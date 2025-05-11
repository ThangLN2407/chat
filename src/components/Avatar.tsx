import { Image, Skeleton } from "antd";
import { useState } from "react";

type Props = {
  src: string | null | undefined;
};

const Avatar = ({ src }: Props) => {
  const [loading, setLoading] = useState(!src);

  return (
    <div className="relative w-[50px] h-[50px] inline-block mr-2">
      {loading && <Skeleton.Avatar active size="large" shape="circle" />}
      {src && (
        <Image
          src={src ?? undefined}
          width={50}
          height={50}
          preview={false}
          alt="avatar"
          className="rounded-full inline-block object-cover"
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
};

export default Avatar;
