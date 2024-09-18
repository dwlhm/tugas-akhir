import { UserPlus } from "react-feather";
import { Input } from "../components/Elements/Forms";
import { BasicButton } from "../components/Elements";
import { usePopup } from "../popup";
import { RegisterRequest, registUser } from "./api";
import { useAuth } from "../auth/context";
import { ReactNode, useState } from "react";

export const NewUser = (props: { token: string }) => {
  const auth = useAuth();
  const popup = usePopup();
  const [resultView, setResultView] = useState<ReactNode | null>(null);

  const doRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      const req_data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      } as RegisterRequest;
      if (auth.user && auth.user.authentication_token)
        registUser(auth.user.authentication_token, req_data).then((data) => {
    console.log(data)
          if (data.body)
            setResultView(
              <p className="capitalize bg-green-300 px-3 py-1 rounded border border-solid border-green-900 text-green-900 text-sm text-center mt-5 w-full">
                Registrasi akun baru berhasil!
              </p>
            );

          if (data.error) {
            const err_list = data.error.map((item, index) => (
              <p
                className="capitalize bg-red-300 px-3 py-1 rounded border border-solid border-red-900 text-red-900 text-sm text-center mt-5 w-full"
                key={`err.msg.login.${index}`}
              >
                {item}
              </p>
            ));
            setResultView(err_list)
          }
        });
      console.log("formData", req_data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <UserPlus className="size-2" />
        </span>
        Daftarkan Alkun Baru
      </h3>
      <form onSubmit={doRegister} className="max-w-xs">
        <Input
          name="name"
          label="Nama"
          placeholder="Masukan nama akun"
          type="text"
        />
        <Input
          name="email"
          label="Email"
          placeholder="Masukan email akun"
          type="email"
        />
        <Input
          name="password"
          label="Password"
          placeholder="Masukan password akun"
          type="password"
        />
        <div className="flex justify-center gap-2">
          <BasicButton type="submit">Tambahkan</BasicButton>
          <BasicButton
            onClick={() => popup.close({})}
            className="flex-grow flex justify-center bg-red-100 border-red-900 hover:bg-red-200"
          >
            Batalkan
          </BasicButton>
        </div>
        {resultView}
      </form>
    </div>
  );
};
