import prisma from "../../prisma/prisma";

export async function fetchOrganizations(organizationNames: string[]) {
  console.log("Fetching organizations for names:", organizationNames);

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        name: {
          in: organizationNames,
        },
      },
    });

    // console.log(
    //   `**********************************\n${JSON.stringify(organizations, null, 2)}\n**********************************`
    // );

    // Reorder results to match organizationNames order
    const orderedOrganizations = organizationNames.map(
      (name) =>
        organizations.find((org) => org.name === name) || {
          name,
          error: "Not Found",
        }
    );

    console.log("Ordered Organizations:", orderedOrganizations);
    return orderedOrganizations;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
