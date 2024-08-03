import z from "zod";
import { InferEnum, InferKeyAsEnum } from "./inferEnum";

export const TestStatus = {
  REQUESTED: "REQUESTED",
  REQUEST_CANCELLED: "REQUEST_CANCELLED",
  REQUEST_DECLINED: "REQUEST_DECLINED",
  REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
  PRODUCT_ORDERED: "PRODUCT_ORDERED",
  PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
  PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
  REVIEW_VALIDATED: "REVIEW_VALIDATED",
  REVIEW_REFUSED: "REVIEW_REFUSED",
  MONEY_SENT: "MONEY_SENT",
  MONEY_RECEIVED: "MONEY_RECEIVED",
  TEST_CANCELLED: "TEST_CANCELLED",
} as const;
export type TestStatus = InferEnum<typeof TestStatus>;

export const Role = {
  TESTER: "TESTER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const;
export type Role = InferEnum<typeof Role>;

export const NotificationType = {
  NEW_REQUEST: "NEW_REQUEST",
  REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
  REQUEST_CANCELLED: "REQUEST_CANCELLED",
  REQUEST_DECLINED: "REQUEST_DECLINED",
  PRODUCT_ORDERED: "PRODUCT_ORDERED",
  PRODUCT_RECEIVED: "PRODUCT_RECEIVED",
  PRODUCT_REVIEWED: "PRODUCT_REVIEWED",
  REVIEW_VALIDATED: "REVIEW_VALIDATED",
  REVIEW_REFUSED: "REVIEW_REFUSED",
  MONEY_SENT: "MONEY_SENT",
  MONEY_RECEIVED: "MONEY_RECEIVED",
  TEST_CANCELLED: "TEST_CANCELLED",
} as const;
export type NotificationType = InferEnum<typeof NotificationType>;

// Need to match front ones
export const NOTIFICATION_TYPES: Record<
  NotificationType,
  {
    value: NotificationType;
    title: string;
    text: string;
    to: string;
  }
> = {
  [NotificationType.NEW_REQUEST]: {
    value: NotificationType.NEW_REQUEST,
    title: "Nouvelle demande de test.",
    text: "Vous avez une nouvelle demande de test pour le produit :",
    to: "/dashboard/received-requests",
  },
  [NotificationType.REQUEST_ACCEPTED]: {
    value: NotificationType.REQUEST_ACCEPTED,
    title: "Demande de test acceptée.",
    text: "Votre demande de test a été acceptée pour le produit :",
    to: "/dashboard/sent-requests",
  },
  [NotificationType.REQUEST_DECLINED]: {
    value: NotificationType.REQUEST_DECLINED,
    title: "Demande de test refusée.",
    text: "Votre demande de test a été refusée pour le produit :",
    to: "/dashboard/sent-requests",
  },
  [NotificationType.REQUEST_CANCELLED]: {
    value: NotificationType.REQUEST_CANCELLED,
    title: "Demande de test annulée.",
    text: "La demande de test a été annulée pour le produit :",
    to: "/dashboard/received-requests",
  },
  [NotificationType.PRODUCT_ORDERED]: {
    value: NotificationType.PRODUCT_ORDERED,
    title: "Produit commandé.",
    text: "Le produit a été commandé :",
    to: "/dashboard/customer-current-tests",
  },
  [NotificationType.PRODUCT_RECEIVED]: {
    value: NotificationType.PRODUCT_RECEIVED,
    title: "Produit reçu.",
    text: "Le produit a été indiqué comme reçu :",
    to: "/dashboard/customer-current-tests",
  },
  [NotificationType.PRODUCT_REVIEWED]: {
    value: NotificationType.PRODUCT_REVIEWED,
    title: "Produit commenté.",
    text: "Le produit a été indiqué comme noté et commenté :",
    to: "/dashboard/customer-current-tests",
  },
  [NotificationType.REVIEW_VALIDATED]: {
    value: NotificationType.REVIEW_VALIDATED,
    title: "Commentaire confirmé.",
    text: "Le vendeur a confirmé le commentaire du produit :",
    to: "/dashboard/my-current-tests",
  },
  [NotificationType.REVIEW_REFUSED]: {
    value: NotificationType.REVIEW_REFUSED,
    title: "Commentaire refusé.",
    text: "Le vendeur a refusé le commentaire du produit :",
    to: "/dashboard/my-current-tests",
  },
  [NotificationType.MONEY_SENT]: {
    value: NotificationType.MONEY_SENT,
    title: "Remboursement envoyé.",
    text: "Le vendeur vous a envoyé de l'argent suite au test du produit :",
    to: "/dashboard/my-current-tests",
  },
  [NotificationType.TEST_CANCELLED]: {
    value: NotificationType.TEST_CANCELLED,
    title: "Annulation ou Réclamation.",
    text: "Une annulation ou une réclamation a été faite sur le produit :",
    to: "/dashboard/customer-current-tests",
  },
  [NotificationType.MONEY_RECEIVED]: {
    value: NotificationType.MONEY_RECEIVED,
    title: "Remboursement reçu.",
    text: "Le tester a indiqué avoir reçu le remboursement sur le produit :",
    to: "/dashboard/finished-tests",
  },
} as const;

export const constants = {
  MONGO_LOCAL_URL: "mongodb://127.0.0.1:27017/test-place",
  FRONTEND_LOCAL_URL: "http://localhost:3000",
  S3_BUCKET: "test-place",
  MAIL_TEMPLATES_IDS: {
    RESET_PASSWORD: {
      fr: "d-d4d5481b37e648b0ad6583ef88d572d6",
      en: "d-bb68b3f6b9fa4974a594ff5ffb267e4c",
      ch: "d-88b15567c0b940998564bef2f3363578",
    },
    VALIDATE_EMAIL: {
      fr: "d-d1da8fb375f742619f281f9b661f2d05",
      en: "d-4c666327a316434c9d30c5212e429882",
      ch: "d-eafffb5b610f403d8d7b24ca419526f3",
    },
    CONTACT_US: {
      fr: "d-f6c3402ef59f461a8657f3b3c3cde90f",
      en: "d-f6c3402ef59f461a8657f3b3c3cde90f",
      ch: "d-f6c3402ef59f461a8657f3b3c3cde90f",
    },
    NOTIFICATION: {
      fr: "d-141262cf223c4349955b40f956003808",
      en: "d-5e97b4d4dbcd4961861013130b835a71",
      ch: "d-4fc7e2093855454ea5c5d3ad443f6e35",
    },
  },
  GENDERS: {
    MALE: "MALE",
    FEMALE: "FEMALE",
  },
};

export const AUTH_CONDITIONS = {
  IS_SELLER: "IS_SELLER",
  ANY: "ANY",
} as const;

export type AuthCondition = InferEnum<typeof AUTH_CONDITIONS>;

export const GLOBAL_TEST_STATUSES = {
  REQUESTED: [
    TestStatus.REQUESTED,
    TestStatus.REQUEST_CANCELLED,
    TestStatus.REQUEST_DECLINED,
  ],
  PROCESSING: [
    TestStatus.REQUEST_ACCEPTED,
    TestStatus.PRODUCT_ORDERED,
    TestStatus.PRODUCT_RECEIVED,
    TestStatus.PRODUCT_REVIEWED,
    TestStatus.REVIEW_VALIDATED,
    TestStatus.MONEY_SENT,
  ],
  COMPLETED: [TestStatus.MONEY_RECEIVED],
  CANCELLED: [TestStatus.REVIEW_REFUSED, TestStatus.TEST_CANCELLED],
} as const;

export type GlobalTestStatus = InferKeyAsEnum<typeof GLOBAL_TEST_STATUSES>;

export const testStatusUpdateParamsSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal(TestStatus.REQUEST_CANCELLED),
    params: z.object({
      cancelRequestReason: z.string(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.REQUEST_DECLINED),
    params: z.object({
      declineRequestReason: z.string(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.REQUEST_ACCEPTED),
    params: z.object({
      sellerMessage: z.string(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.PRODUCT_ORDERED),
    params: z.object({
      orderId: z.string(),
      orderScreenshotUrl: z.string(),
      estimatedDeliveryDate: z.date().min(new Date()).optional(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.PRODUCT_RECEIVED),
  }),
  z.object({
    status: z.literal(TestStatus.PRODUCT_REVIEWED),
    params: z.object({
      reviewId: z.string(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.REVIEW_VALIDATED),
  }),
  z.object({
    status: z.literal(TestStatus.REVIEW_REFUSED),
    params: z.object({
      declineReviewReason: z.string(),
    }),
  }),
  z.object({
    status: z.literal(TestStatus.MONEY_SENT),
  }),
  z.object({
    status: z.literal(TestStatus.MONEY_RECEIVED),
  }),
  z.object({
    status: z.literal(TestStatus.TEST_CANCELLED),
    params: z.object({
      cancelReason: z.string(),
    }),
  }),
]);

export type TestStatusUpdateParams = z.infer<typeof testStatusUpdateParamsSchema>;

type TestStatusProcessStep = {
  previous: TestStatus | Array<TestStatus>;
  role?: Role;
  params?: string[];
  notificationType: NotificationType;
};

export const TEST_STATUS_PROCESSES: Record<
  Exclude<TestStatus, "REQUESTED">,
  TestStatusProcessStep
> = {
  [TestStatus.REQUEST_CANCELLED]: {
    previous: TestStatus.REQUESTED,
    role: Role.TESTER,
    notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED.value,
  },
  [TestStatus.REQUEST_DECLINED]: {
    previous: TestStatus.REQUESTED,
    role: Role.SELLER,
    notificationType: NOTIFICATION_TYPES.REQUEST_DECLINED.value,
  },
  [TestStatus.REQUEST_ACCEPTED]: {
    previous: TestStatus.REQUESTED,
    role: Role.SELLER,
    notificationType: NOTIFICATION_TYPES.REQUEST_ACCEPTED.value,
  },
  [TestStatus.PRODUCT_ORDERED]: {
    previous: TestStatus.REQUEST_ACCEPTED,
    role: Role.TESTER,
    notificationType: NOTIFICATION_TYPES.PRODUCT_ORDERED.value,
  },
  [TestStatus.PRODUCT_RECEIVED]: {
    previous: TestStatus.PRODUCT_ORDERED,
    role: Role.TESTER,
    notificationType: NOTIFICATION_TYPES.PRODUCT_RECEIVED.value,
  },
  [TestStatus.PRODUCT_REVIEWED]: {
    previous: TestStatus.PRODUCT_RECEIVED,
    role: Role.TESTER,
    notificationType: NOTIFICATION_TYPES.PRODUCT_REVIEWED.value,
  },
  [TestStatus.REVIEW_VALIDATED]: {
    previous: TestStatus.PRODUCT_REVIEWED,
    role: Role.SELLER,
    notificationType: NOTIFICATION_TYPES.REVIEW_VALIDATED.value,
  },
  [TestStatus.REVIEW_REFUSED]: {
    previous: TestStatus.PRODUCT_REVIEWED,
    role: Role.SELLER,
    notificationType: NOTIFICATION_TYPES.REVIEW_REFUSED.value,
  },
  [TestStatus.MONEY_SENT]: {
    previous: TestStatus.REVIEW_VALIDATED,
    role: Role.SELLER,
    notificationType: NOTIFICATION_TYPES.MONEY_SENT.value,
  },
  [TestStatus.MONEY_RECEIVED]: {
    previous: [TestStatus.MONEY_SENT, TestStatus.REVIEW_VALIDATED],
    notificationType: NOTIFICATION_TYPES.MONEY_RECEIVED.value,
  },
  [TestStatus.TEST_CANCELLED]: {
    previous: Object.values(TestStatus).filter(
      (status: string) =>
        !(
          [TestStatus.TEST_CANCELLED, TestStatus.MONEY_RECEIVED] as Array<string>
        ).includes(status)
    ),
    notificationType: NOTIFICATION_TYPES.TEST_CANCELLED.value,
  },
} as const;

export const VALID_TEST_STATUSES: Array<TestStatus> = [
  TestStatus.REQUESTED,
  TestStatus.REQUEST_ACCEPTED,
  TestStatus.PRODUCT_ORDERED,
  TestStatus.PRODUCT_RECEIVED,
  TestStatus.PRODUCT_REVIEWED,
  TestStatus.REVIEW_VALIDATED,
] as const;
