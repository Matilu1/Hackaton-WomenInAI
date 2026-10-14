import Image from "next/image";

/** Bakgrunnsbildet fra forsiden, dempet så teksten på undersidene er lett å lese. */
export default function PageBackdrop() {
  return (
    <div className="fixed inset-0" aria-hidden="true">
      <Image
        src="/ny-bakgrunn.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="page-scrim absolute inset-0" />
    </div>
  );
}
