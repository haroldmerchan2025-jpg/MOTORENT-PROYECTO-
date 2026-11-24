// frontend/src/components/Icons.tsx
// Conjunto liviano de íconos SVG vectoriales para mantener una interfaz limpia y uniforme.

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function baseProps(size: number, props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

export const IconShieldCheck = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconCreditCard = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

export const IconClock = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

export const IconCompass = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const IconKey = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
);

export const IconWallet = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
);

export const IconCalendar = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const IconFileText = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const IconMail = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

export const IconEye = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export const IconUser = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconIdCard = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5.5 16a3 3 0 0 1 5 0" />
    <line x1="14" y1="10" x2="19" y2="10" />
    <line x1="14" y1="14" x2="18" y2="14" />
  </svg>
);

export const IconLandmark = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);

export const IconAlertTriangle = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <path d="m10.29 3.86-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const IconCheckCircle = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconInfo = ({ size = 18, ...props }: IconProps) => (
  <svg {...baseProps(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
