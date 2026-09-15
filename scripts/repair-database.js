const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ACTIVE_USER_ID = 'user_3IjRjyQjGcgA8OtTA26Qnw2Q6S5';

async function main() {
  console.log('--- Starting Database Repair ---');
  
  const organizations = await prisma.organization.findMany({
    include: {
      members: true,
      projects: true,
    },
  });

  console.log(`Found ${organizations.length} total organizations in database.`);

  for (const org of organizations) {
    const hasActiveUser = org.members.some((m) => m.userId === ACTIVE_USER_ID);
    
    if (!hasActiveUser) {
      console.log(`Adding ${ACTIVE_USER_ID} as ADMIN to organization "${org.name}" (${org.id}) [${org.projects.length} projects]...`);
      await prisma.member.upsert({
        where: {
          userId_organizationId: {
            userId: ACTIVE_USER_ID,
            organizationId: org.id,
          },
        },
        update: {
          role: 'ADMIN',
        },
        create: {
          userId: ACTIVE_USER_ID,
          organizationId: org.id,
          role: 'ADMIN',
        },
      });
    } else {
      const member = org.members.find((m) => m.userId === ACTIVE_USER_ID);
      if (member && member.role !== 'ADMIN') {
        console.log(`Promoting ${ACTIVE_USER_ID} to ADMIN in organization "${org.name}" (${org.id})...`);
        await prisma.member.update({
          where: { id: member.id },
          data: { role: 'ADMIN' },
        });
      }
    }
  }

  const updatedMemberships = await prisma.member.findMany({
    where: { userId: ACTIVE_USER_ID },
    include: {
      organization: {
        include: {
          projects: true,
        },
      },
    },
  });

  const totalVisibleProjects = updatedMemberships.reduce((acc, m) => acc + m.organization.projects.length, 0);

  console.log('--- Database Repair Complete ---');
  console.log(`User ${ACTIVE_USER_ID} now belongs to ${updatedMemberships.length} organizations.`);
  console.log(`Total visible projects now: ${totalVisibleProjects}`);
}

main()
  .catch((e) => {
    console.error('Database repair failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
