import prisma from "../../prisma/prisma";

export async function fetchOrganizations(organizationNames: any) {
    try {
      const organizations = await prisma.organization.findMany({
        where: {
          name: {
            in: organizationNames,
          },
        },
      });
  
      // Reorder results to match organizationNames order
      const orderedOrganizations = organizationNames.map((name: any) =>
        organizations.find((org) => org.name === name) || null
      );
  
      console.log('Ordered Organizations:', orderedOrganizations);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

