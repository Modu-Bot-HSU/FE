import AnimatedBottomSheet from "../../../components/common/AnimatedBottomSheet";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ open, onCancel, onConfirm }: Props) {
  return (
    <AnimatedBottomSheet open={open} onBackdropClick={onCancel} durationMs={280}>
      <div className="relative w-full max-w-[430px] rounded-t-3xl bg-white px-5 pt-6 pb-10 shadow-xl">
        <div className="mb-4 text-center">
          <p className="text-[17px] font-semibold text-[#002A47]">로그아웃 하시겠어요?</p>
          <p className="mt-1.5 text-[13px] text-[#78716D]">로그인 페이지로 이동합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[#D6D3D1] bg-[#f4f4f4] py-3 text-[14px] font-medium text-[#44403D]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#C0392B] py-3 text-[14px] font-medium text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </AnimatedBottomSheet>
  );
}
