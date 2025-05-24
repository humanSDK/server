import { extendType } from "nexus";


export const UserQueries=extendType({
    type:'Query',
    definition(t) {
        t.field('getUser',{
            type:'User',
            args:{},
            resolve:async(parent,_args,ctx)=>{
                if(!ctx.user) throw new Error("Unauthorized Access");
                return await ctx.prisma.user.findUnique({
                    where:{ id:ctx.user.id }
                })
            }
        })
    },
})