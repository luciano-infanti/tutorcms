import { getServerSession as nextAuthGetServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function getServerSession() {
    return nextAuthGetServerSession(authOptions)
}
