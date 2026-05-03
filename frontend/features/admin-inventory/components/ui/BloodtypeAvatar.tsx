const CRITICAL_TYPES = ['O-', 'AB-', 'A-'];

interface BloodTypeAvatarProps {
  type: string;
}

export function BloodTypeAvatar({ type }: BloodTypeAvatarProps) {
  const isCritical = CRITICAL_TYPES.includes(type);

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border text-sm shrink-0
        ${
          isCritical
            ? 'bg-rose-50 text-rose-600 border-rose-100'
            : 'bg-gray-50 text-gray-600 border-gray-100'
        }`}
    >
      {type}
    </div>
  );
}
