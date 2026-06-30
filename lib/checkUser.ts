import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { PLANS } from "./constants";
import type { Plan } from "@/types/plans";

const getCurrentPlan = async (): Promise<Plan> => {
  const { has } = await auth();
  if (has({ plan: "pro" })) return "pro";
  if (has({ plan: "starter" })) return "starter";
  return "free";
};

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const currentPlan = await getCurrentPlan();

    const existing = await db.user.findUnique({
      where: { clerkId: user.id },
    });

  
        if (existing) {
      // User exists, check if the plan has changed 
      if (existing.plan !== currentPlan) {
        const newPlan = currentPlan as Plan;
        const newPlanCredits = PLANS[newPlan].credits;

        // Update the user's plan and credits
        const totalCredits = (existing.credits ?? 0) + newPlanCredits;

        await db.user.update({
          where: { clerkId: user.id },
          data: {
            plan: newPlan,
            credits: totalCredits,
          },
        });

        return await db.user.findUnique({ where: { clerkId: user.id } });
      }

      return existing;
    }

    return await db.user.create({
      data: {
        clerkId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
        credits: PLANS[currentPlan].credits,
        plan: currentPlan,
      },
    });
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};