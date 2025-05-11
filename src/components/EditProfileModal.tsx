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
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: "",
      photoURL: user?.photoURL ?? "",
    },
  });

  const handleClose = () => {
    reset({
      displayName: "",
      photoURL: user?.photoURL ?? "",
    });
    onClose();
  };

  const onSubmit = (values: FormValues) => onSubmitData(values);

  return (
    <Modal
      title="Chỉnh sửa thông tin cá nhân"
      open={open}
      onCancel={handleClose}
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
              <Input
                {...field}
                className="mt-5"
                placeholder="Nhập tên hiển thị"
              />
            )}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <img
            className="w-20 h-20 object-contain border-2 border-gray-300 rounded-full"
            src={getValues("photoURL") || user?.photoURL || ""}
            alt="avatar"
          />
        </div>
        <div>
          <label className="font-semibold mr-5">Ảnh đại diện</label>
          <UploadImage
            userId={user?.uid ?? null}
            onUpload={(url: string) => {
              setValue("photoURL", url, { shouldValidate: true });
            }}
          />
          {errors.photoURL && (
            <p className="text-red-500 text-sm">{errors.photoURL.message}</p>
          )}
        </div>

        {/* Nút */}
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
