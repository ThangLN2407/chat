import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Spin, Upload } from "antd";
import { type UploadChangeParam } from "antd/es/upload";
import { type RcFile } from "antd/es/upload/interface";
import { uploadImageToCloudinary } from "../cloudinary";
import { useState } from "react";

type Props = {
  userId: string | null;
  onUpload: (url: string) => void;
};

const UploadImage = ({ userId, onUpload }: Props) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ chấp nhận ảnh (jpg/png/webp)");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleUpload = async (info: UploadChangeParam) => {
    const file = info.file.originFileObj as RcFile;

    if (!file || !userId) return;

    try {
      setLoading(true);
      const result = await uploadImageToCloudinary(file);
      onUpload(result);
      message.success("Tải ảnh lên thành công!");
      setLoading(false);
    } catch (error) {
      console.error("Upload thất bại", error);
      message.error("Tải ảnh thất bại!");
    }
  };

  return (
    <>
      {loading ? (
        <Spin></Spin>
      ) : (
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={() => {}} // tránh upload tự động
          onChange={handleUpload}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      )}
    </>
  );
};

export default UploadImage;
