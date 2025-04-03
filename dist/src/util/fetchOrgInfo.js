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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOrganizations = fetchOrganizations;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
function fetchOrganizations(organizationNames) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching organizations for names:", organizationNames);
        try {
            const organizations = yield prisma_1.default.organization.findMany({
                where: {
                    name: {
                        in: organizationNames,
                    },
                },
            });
            console.log(`**********************************\n${JSON.stringify(organizations, null, 2)}\n**********************************`);
            // Reorder results to match organizationNames order
            const orderedOrganizations = organizationNames.map((name) => organizations.find((org) => org.name === name) || { name, error: "Not Found" });
            console.log("Ordered Organizations:", orderedOrganizations);
            return orderedOrganizations;
        }
        catch (error) {
            console.error("Error fetching organizations:", error);
            return [];
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
