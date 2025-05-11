import { Modal, Button, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UploadImage from "./UploadImage"; // component trả về URL ảnh
import { type UserType } from "../types/user";

type FormValues = {
  displayName: string;
  photoURL: string;
};

const schema = yup.object().shape({
  displayName: yup.string().required("Tên không được để trống"),
  photoURL: yup.string().required("Vui lòng chọn ảnh đại diện"),
});

type Props = {
  user: UserType | null;
  open: boolean;
  onClose: () => void;
  onSubmitData: (data: FormValues) => void;
};

const EditProfileModal = ({ user, open, onClose, onSubmitData }: Props) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: user?.displayName ?? "",
      photoURL: user?.photoURL ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("🎯 Submit giá trị:", values);
    onSubmitData(values);
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin cá nhân"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tên hiển thị */}
        <div>
          <label className="font-semibold">Tên hiển thị</label>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập tên hiển thị" />
            )}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm">{errors.displayName.message}</p>
          )}
        </div>

        {/* Ảnh đại diện */}
        <div>
          <label className="font-semibold">Ảnh đại diện</label>
          <UploadImage
            userId={user?.uid ?? null}
            onUpload={(url: string) => {
              console.log("📸 Upload thành công:", url);
              setValue("photoURL", url, { shouldValidate: true });
            }}
          />
          {errors.photoURL && (
            <p className="text-red-500 text-sm">{errors.photoURL.message}</p>
          )}
        </div>

        {/* Nút */}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
