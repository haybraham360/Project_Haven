import Link from "next/link";
import { focusRing } from "@/components/ui";

export function SafetyBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-sm text-white">
      Haven is not an emergency service. If you are in immediate danger, contact your
      local emergency number.{" "}
      <Link href="/#safety" className={`font-semibold underline underline-offset-4 ${focusRing} rounded`}>
        Get help now
      </Link>
    </div>
  );
}
