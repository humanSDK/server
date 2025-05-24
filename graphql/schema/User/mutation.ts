import { extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export const UserMutations=extendType({
    type:'Mutation',
    definition(t) {
        t.field('createUser',{
            type:'User',
            args:{
                name:nonNull(stringArg()),
                email:nonNull(stringArg()),
                password:nonNull(stringArg())
            },
            resolve:async(parent,_args,ctx)=>{
                const {name,email,password}=_args;
                // Hash the password before storing it
                const hashedPassword = await bcrypt.hash(password, 10);
                const token = crypto.randomBytes(32).toString("hex");
                
                const newUser=await ctx.prisma.user.create({
                    data:{
                        email,
                        name,
                        hashedPassword,
                        verifyToken:token,
                    }
                })
                
                await sendVerificationEmail(email, token);
                
                return newUser;
            }
        })
    },
})