import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to Vercel settings", {
      status: 500,
    });
  }

  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", { status: 400 });
  }

  const eventType = evt?.type;

  // Gracefully handle test webhooks or unknown event types without crashing
  if (!eventType) {
    return NextResponse.json({ success: true, message: "Received test or empty event" }, { status: 200 });
  }

  try {
    if (eventType === "organization.created" || eventType === "organization.updated") {
      const data = evt.data as { id?: string; name?: string };
      if (data?.id && data?.name) {
        await prisma.organization.upsert({
          where: { id: data.id },
          update: { name: data.name },
          create: { id: data.id, name: data.name },
        });
      }
    }

    if (eventType === "organization.deleted") {
      const data = evt.data as { id?: string };
      if (data?.id) {
        await prisma.organization.delete({
          where: { id: data.id },
        });
      }
    }

    if (eventType === "organizationMembership.created") {
      const data = evt.data as any;
      const org = data?.organization;
      const userData = data?.public_user_data;

      if (org?.id && userData?.user_id) {
        const rawRole = data.role ? data.role.replace("org:", "").toUpperCase() : "MEMBER";
        const memberRole: Role = rawRole === "ADMIN" ? Role.ADMIN : Role.MEMBER;

        await prisma.organization.upsert({
          where: { id: org.id },
          update: { name: org.name || "Unnamed Workspace" },
          create: { id: org.id, name: org.name || "Unnamed Workspace" },
        });

        await prisma.member.upsert({
          where: {
            userId_organizationId: {
              userId: userData.user_id,
              organizationId: org.id,
            },
          },
          update: {
            role: memberRole,
          },
          create: {
            userId: userData.user_id,
            organizationId: org.id,
            role: memberRole,
          },
        });
      }
    }

    if (eventType === "organizationMembership.deleted") {
      const data = evt.data as any;
      if (data?.public_user_data?.user_id && data?.organization?.id) {
        await prisma.member.deleteMany({
          where: {
            userId: data.public_user_data.user_id,
            organizationId: data.organization.id,
          },
        });
      }
    }
  } catch (dbError) {
    console.error("Database operation failed during webhook handling:", dbError);
    return new Response(`Database error: ${dbError instanceof Error ? dbError.message : "Unknown error"}`, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}