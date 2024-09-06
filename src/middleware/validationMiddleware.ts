import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export function validateData(
  schema: z.ZodObject<any, any> | z.ZodEffects<any>,
  targets: ("body" | "query" | "params")[] = ["body"],
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      targets.forEach((target) => {
        if (target in req) {
          const validatedData = schema.parse(req[target]);
          req[target] = validatedData;
        }
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} : ${issue.message}`,
        }));
        res.status(422).json({ errors: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
