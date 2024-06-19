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
const trpc_1 = require("./trpc");
const standalone_1 = require("@trpc/server/adapters/standalone");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const note = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
const updateNote = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
const deleteNote = zod_1.z.object({
    id: zod_1.z.number()
});
const appRouter = (0, trpc_1.router)({
    createNote: trpc_1.publicProcedure.input(note).
        mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let title = opts.input.title;
        let content = opts.input.content;
        const d = yield prisma.note.create({
            data: {
                title: title,
                content: content
            }
        });
        return { d };
    })),
    fetchNotes: trpc_1.publicProcedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        const d = yield prisma.note.findMany();
        return d.map((note) => { return { id: note.id, title: note.title, content: note.content }; });
    })),
    updateNote: trpc_1.publicProcedure.input(updateNote).mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        let id = opts.input.id;
        let title = opts.input.title;
        let content = opts.input.content;
        const d = yield prisma.note.update({
            where: {
                id: id
            },
            data: {
                title: title,
                content: content
            }
        });
        return {};
    })),
    deleteNote: trpc_1.publicProcedure
        .input(zod_1.z.object({
        id: zod_1.z.number(),
    }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedNote = yield prisma.note.delete({
                where: { id: input.id },
            });
            return deletedNote;
        }
        catch (error) {
            console.error(error);
        }
    }))
});
const server = (0, standalone_1.createHTTPServer)({
    middleware: (0, cors_1.default)(),
    router: appRouter,
});
server.listen(3000, () => {
    console.log("server started at port 3000");
});
