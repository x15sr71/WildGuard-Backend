"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const organizations = [
    {
        "name": "Periyar Wildlife Sanctuary",
        "summary": "Specializes in wildlife conservation and habitat preservation in Kerala, focusing on elephants, tigers, and native species. Offers conservation initiatives, research, eco-tourism, and educational programs in collaboration with the Kerala Forest Department."
    },
    {
        "name": "Bombay Veterinary College",
        "summary": "Provides comprehensive veterinary education and wildlife treatment in Mumbai. Specializes in the care of various animals through veterinary care, research, and training programs, including internship opportunities."
    },
    {
        "name": "World Animal Protection India",
        "summary": "Dedicated to animal welfare and emergency rescue across India with a focus on vulnerable species. Offers round-the-clock emergency response, rehabilitation, and advocacy services for all animals."
    },
    {
        "name": "Vindhyan Ecology and Natural History Foundation (VENHF)",
        "summary": "Focuses on environmental protection and advocacy in the Vindhya region. Specializes in local wildlife conservation through research, conservation initiatives, and regional advocacy."
    },
    {
        "name": "Wildlife Institute of India (WII)",
        "summary": "Specializes in wildlife research and training for all species nationwide. Provides advanced research, training, and conservation programs with government accreditation and support."
    },
    {
        "name": "Nilgiri Wildlife and Environment Association (NWEA)",
        "summary": "Focuses on wildlife conservation and environmental education in the Nilgiri region, specializing in species such as elephants and tigers. Offers conservation projects, educational workshops, and advocacy programs."
    },
    {
        "name": "Tamil Nadu Veterinary and Animal Sciences University (TANUVAS)",
        "summary": "Provides veterinary care and animal sciences education for all species, including wildlife. Offers research, clinical services, and educational programs as an accredited institution with internship opportunities."
    },
    {
        "name": "Ranthambore National Park",
        "summary": "Specializes in tiger conservation and wildlife preservation in Rajasthan, with a focus on tigers and leopards. Offers conservation programs, research initiatives, and eco-tourism experiences."
    },
    {
        "name": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
        "summary": "A government body overseeing environmental policy and wildlife conservation nationwide. Implements conservation programs and policies for all species, driving national environmental initiatives."
    },
    {
        "name": "Centre for Bear Rehabilitation and Conservation (CBRC)",
        "summary": "Specializes in the rehabilitation and rescue of displaced bear cubs near Pakke Tiger Reserve. Offers 24/7 emergency support and rehabilitation services as part of the Wildlife Trust of India."
    },
    {
        "name": "Centre for Wildlife Rehabilitation and Conservation (CWRC)",
        "summary": "Focuses on the rehabilitation and emergency care of local wildlife near Kaziranga Tiger Reserve. Provides 24/7 rescue and rehabilitation services, and is affiliated with the Wildlife Trust of India."
    },
    {
        "name": "Arulagam",
        "summary": "Focuses on vulture conservation and community engagement in Tamil Nadu. Specializes in the rescue, conservation, and research of vultures and other bird species. Conducts educational outreach programs and collaborates with local wildlife groups to promote sustainable conservation efforts."
    },
    {
        "name": "Aaranyak",
        "summary": "Dedicated to biodiversity conservation and research across Northeast India. Engages in wildlife research, conservation projects, and community-based environmental initiatives. Conducts workshops and seminars to raise awareness and collaborates with government and NGO partners."
    },
    {
        "name": "Animal Welfare Board of India (AWBI)",
        "summary": "A statutory body overseeing animal welfare policies and advocacy in India. Provides guidance on animal welfare laws, policy implementation, and advisory services. Focuses on national-level animal protection initiatives and policy reforms."
    },
    {
        "name": "PETA India",
        "summary": "Advocates for animal rights and ethical treatment across India. Conducts awareness campaigns, policy advocacy, and limited rescue support. Provides educational programs on animal welfare and collaborates with international PETA networks to promote ethical practices."
    },
    {
        "name": "Wildlife SOS 24-Hour Rescue Helpline",
        "summary": "Operates a nationwide 24/7 emergency rescue service for multiple wildlife species. Specializes in rapid response for injured or distressed animals. Conducts public awareness programs and collaborates with government and conservation organizations for rescue operations."
    },
    {
        "name": "Blue Cross of India",
        "summary": "Rescues and rehabilitates domestic animals, particularly dogs and cats, in Maharashtra. Provides shelter, medical care, and adoption services. Conducts educational workshops and awareness campaigns on animal welfare and responsible pet ownership."
    },
    {
        "name": "Dharamsala Animal Rescue (DAR)",
        "summary": "Specializes in rescuing, rehabilitating, and rehoming street dogs in Dharamsala. Offers emergency veterinary care, adoption programs, and community awareness initiatives. Works with local volunteers to improve street animal welfare."
    },
    {
        "name": "Wildlife SOS",
        "summary": "Specializes in the rescue and rehabilitation of elephants, bears, leopards, and other wildlife in distress. Operates a 24/7 emergency response service across India. Provides medical treatment, long-term rehabilitation, and conservation awareness programs."
    },
    {
        "name": "National Centre for Biological Sciences (NCBS)",
        "summary": "Focuses on wildlife biology and conservation research. Conducts studies on biodiversity and ecosystem preservation. Offers educational programs, seminars, and research opportunities in partnership with academic and government institutions."
    },
    {
        "name": "Help in Suffering (HIS)",
        "summary": "Provides veterinary care, shelter, and rehabilitation for injured and abandoned animals in Rajasthan. Offers emergency response services and conducts public awareness programs on animal welfare."
    },
    {
        "name": "Nityata Foundation",
        "summary": "Engages in wildlife conservation through community involvement and awareness programs in Karnataka. Conducts conservation projects for regional species and collaborates with local organizations for ecological sustainability."
    },
    {
        "name": "People For Animals (PFA) India",
        "summary": "India’s largest animal welfare organization, involved in rescue, rehabilitation, and advocacy for various animals. Operates shelters and adoption programs while conducting legal advocacy for animal rights across the country."
    },
    {
        "name": "Himalayan Animal Rescue Trust (HART)",
        "summary": "Specializes in rescuing and rehabilitating native Himalayan wildlife and domestic animals. Provides veterinary care and emergency response in remote mountain regions. Conducts community education programs on humane animal treatment."
    }
];
function updateSummaries() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const org of organizations) {
            try {
                const updatedOrg = yield prisma.organization.updateMany({
                    where: { name: org.name },
                    data: { summary: org.summary }
                });
                if (updatedOrg.count > 0) {
                    console.log(`Updated: ${org.name} -> ${org.summary}`);
                }
                else {
                    console.log(`No matching organization found for: ${org.name}`);
                }
            }
            catch (error) {
                console.error(`Error updating ${org.name}:`, error);
            }
        }
        yield prisma.$disconnect();
    });
}
updateSummaries();
