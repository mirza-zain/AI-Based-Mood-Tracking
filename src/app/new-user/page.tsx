import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "../../../utilis/db"
import { redirect } from "next/navigation"

const createNewUser = async () => {
  const user = await currentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    }
  })

  if(!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,  
      }
    })
  }

  redirect("/journal")
}

const NewUser = async () => {
  await createNewUser()
  return (
    <div>...Loading</div>
  )
}

export default NewUser