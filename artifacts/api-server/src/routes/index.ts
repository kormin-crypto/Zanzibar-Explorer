import { Router, type IRouter } from "express";
import healthRouter from "./health";
import activitiesRouter from "./activities";
import accommodationsRouter from "./accommodations";
import packagesRouter from "./packages";
import estimateRouter from "./estimate";
import inquiriesRouter from "./inquiries";
import summaryRouter from "./summary";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(activitiesRouter);
router.use(accommodationsRouter);
router.use(packagesRouter);
router.use(estimateRouter);
router.use(inquiriesRouter);
router.use(summaryRouter);
router.use(adminRouter);

export default router;
