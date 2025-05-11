import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { type UploadChangeParam } from "antd/es/upload";
import { type RcFile } from "antd/es/upload/interface";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type Props = {
  userId: string | null;
  onUpload: (url: string) => void;
};

const UploadImage = ({ userId, onUpload }: Props) => {
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

    const filePath = `avatars/${userId}/${userId}`;
    const imageRef = ref(storage, filePath);

    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      onUpload(downloadURL);
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Upload thất bại", error);
      message.error("Tải ảnh thất bại!");
    }
  };

  return (
    <Upload
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={() => {}} // tránh upload tự động
      onChange={handleUpload}
    >
      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
    </Upload>
  );
};

export default UploadImage;
