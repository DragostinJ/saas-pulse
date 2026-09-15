import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel settings");
  }

  // Retrieve headers directly from the native Request object
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    // Double cast through unknown to satisfy strict TypeScript validation
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "organization.created" || eventType === "organization.updated") {
    const { id, name } = evt.data;

    await prisma.organization.upsert({
      where: { id },
      update: { name },
      create: {
        id,
        name,
      },
    });
  }

  if (eventType === "organization.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.organization.delete({
        where: { id },
      });
    }
  }

  if (eventType === "organizationMembership.created") {
    const { organization, public_user_data, role } = evt.data;

    await prisma.member.create({
      data: {
        userId: public_user_data.user_id,
        organizationId: organization.id,
        role: role.replace("org:", "").toUpperCase(),
      },
    });
  }

  if (eventType === "organizationMembership.deleted") {
    const { organization, public_user_data } = evt.data;

    await prisma.member.deleteMany({
      where: {
        userId: public_user_data.user_id,
        organizationId: organization.id,
      },
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}