import { publicProcedure, router } from "./trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import {z} from 'zod';

const prisma = new PrismaClient();

const note = z.object({
    title:z.string(),
    content:z.string()
})

const updateNote = z.object({
    id:z.number(),
    title:z.string(),
    content:z.string()

})

const deleteNote = z.object({
    id:z.number()
});

const appRouter = router({
    createNote: publicProcedure.input(note).
    mutation(async(opts)=>{
        let title = opts.input.title;
        let content = opts.input.content;
        const d = await prisma.note.create({
            data:{
                title:title,
                content:content
            }
        });
        return {d}
        
    })
    ,
    fetchNotes: publicProcedure.query(async()=>{
        const d = await prisma.note.findMany();
        return d.map((note)=>{return {id:note.id,title:note.title,content:note.content}});
    })
    ,
    updateNote: publicProcedure.input(updateNote).mutation(async(opts)=>{
        let id = opts.input.id;
        let title = opts.input.title;
        let content = opts.input.content;
        const d = await prisma.note.update({
            where:{
                id:id
            },
            data:{
                title:title,
                content:content
            }
        });
        return {}
    })
    ,
    deleteNote: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const deletedNote = await prisma.note.delete({
          where: { id: input.id },
        });
        return deletedNote;
      } catch (error) {
        console.error(error);
      }
    })
})



const server = createHTTPServer({
    middleware:cors(),
    router: appRouter,
    
});

server.listen(3000,()=>{
    console.log("server started at port 3000");
});
export type AppRouter = typeof appRouter;