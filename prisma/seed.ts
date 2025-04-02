import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organizations = [
    {
      "name": "Arulagam",
      "summary": "Arulagam focuses on vulture conservation and community engagement in Tamil Nadu. They provide rescue, conservation, and research services while actively working with local wildlife groups."
    },
    {
      "name": "Periyar Wildlife Sanctuary",
      "summary": "Located in Kerala, Periyar Wildlife Sanctuary is dedicated to wildlife conservation and habitat preservation. It specializes in elephants, tigers, and native species while promoting eco-tourism and research."
    },
    {
      "name": "Ranthambore National Park",
      "summary": "Ranthambore National Park in Rajasthan is a key tiger conservation area. It offers conservation programs, research initiatives, and guided tourism to raise awareness about tiger preservation."
    },
    {
      "name": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
      "summary": "MoEFCC is India's central governing body for environmental policies and wildlife conservation. It oversees national conservation programs, policy implementation, and public awareness campaigns."
    },
    {
      "name": "Tamil Nadu Veterinary and Animal Sciences University (TANUVAS)",
      "summary": "TANUVAS in Chennai is a government-recognized veterinary university offering animal healthcare, research, and education. It provides veterinary services for domestic and wild animals."
    },
    {
      "name": "Bombay Veterinary College",
      "summary": "Bombay Veterinary College in Mumbai specializes in veterinary education and wildlife treatment. It provides medical care, research opportunities, and training programs for students and professionals."
    },
    {
      "name": "Wildlife SOS 24-Hour Rescue Helpline",
      "summary": "Wildlife SOS operates a 24/7 rescue helpline across India, responding to emergency wildlife situations. It focuses on animal rescue, rehabilitation, and public awareness campaigns."
    },
    {
      "name": "People For Animals (PFA) India",
      "summary": "PFA India is a national animal welfare organization offering rescue, rehabilitation, adoption, and advocacy services. It promotes awareness campaigns and policy changes for animal protection."
    },
    {
      "name": "Blue Cross of India",
      "summary": "Blue Cross of India, based in Mumbai, specializes in rescuing and rehabilitating domestic animals. It provides shelter, medical care, and adoption services while running educational programs."
    },
    {
      "name": "PETA India",
      "summary": "PETA India is dedicated to animal rights advocacy, promoting ethical treatment and awareness campaigns. It works on policy changes, rescue support, and educational initiatives across India."
    },
    {
      "name": "Animal Welfare Board of India (AWBI)",
      "summary": "AWBI is a statutory body under the Government of India responsible for overseeing animal welfare policies. It provides advisory services and promotes awareness programs nationwide."
    },
    {
      "name": "World Animal Protection India",
      "summary": "World Animal Protection India is an international organization focusing on animal welfare, emergency rescue, and advocacy. It runs campaigns and provides rehabilitation for vulnerable species."
    },
    {
      "name": "Himalayan Animal Rescue Trust (HART)",
      "summary": "HART operates in the Himalayan region, specializing in the rescue, rehabilitation, and veterinary care of native species and domestic animals. It also conducts community awareness programs."
    }
  ]
  

  for (const org of organizations) {
    await prisma.organization.updateMany({
      where: { name: org.name },
      data: { 
        summary: org.summary,
      }
    });
  }

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });