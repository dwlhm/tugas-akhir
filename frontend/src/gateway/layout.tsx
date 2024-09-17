import { Eye, PlusCircle } from "react-feather";
import { useAuth, User } from "../auth/context";
import { usePopup } from "../popup";
import { addgateway, editgateway, Gateway, MqttCredential } from "./api";
import { Input } from "../components/Elements/Forms";
import { BasicButton } from "../components/Elements";
import { date, string } from "zod";

export const GatewayBaru = () => {
  const auth = useAuth();
  const popup = usePopup<Gateway>();
  const putNode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      name: (e.target as any)[0].value as string,
      address: (e.target as any)[1].value as string,
    };

    const response = await addgateway(
      auth.user as User,
      rawData.name,
      rawData.address
    );

    if (response.body) {
      popup.close(response.body);
      location.reload();
    }
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <PlusCircle className="size-2" />
        </span>
        Tambah Gateway Baru
      </h3>
      <form onSubmit={putNode} className="max-w-xs">
        <Input
          name="nama"
          label="Nama Gateway"
          placeholder="Masukan nama node"
          type="text"
        />
        <Input
          name="alamat"
          label="Alamat Gateway"
          placeholder="Masukan alamat node"
          type="text"
        />
        <div className="flex justify-center gap-2">
          <BasicButton type="submit">Tambahkan</BasicButton>
          <BasicButton
            onClick={() => popup.close({} as Gateway)}
            className="flex-grow flex justify-center bg-red-100 border-red-900 hover:bg-red-200"
          >
            Batalkan
          </BasicButton>
        </div>
      </form>
    </div>
  );
};

export const EditGateway = (props: {
  gatewayId: string;
  name: string;
  address: string;
}) => {
  const auth = useAuth();
  const popup = usePopup<Gateway>();
  const putNode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rawData = {
      name: (e.target as any)[0].value as string,
      address: (e.target as any)[1].value as string,
    };

    const response = await editgateway(
      auth.user as User,
      props.gatewayId,
      rawData.name,
      rawData.address
    );

    if (response.body) {
      popup.close(response.body);
      location.reload();
    }
  };
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <PlusCircle className="size-2" />
        </span>
        Edit Informasi Gateway
      </h3>
      <form onSubmit={putNode} className="max-w-xs">
        <Input
          name="nama"
          label="Nama Gateway"
          placeholder="Masukan nama node"
          defaultValue={props.name}
          type="text"
        />
        <Input
          name="alamat"
          label="Alamat Gateway"
          placeholder="Masukan alamat node"
          defaultValue={props.address}
          type="text"
        />
        <div className="flex justify-center gap-2">
          <BasicButton type="submit">Simpan Perubahan</BasicButton>
          <BasicButton
            onClick={() => popup.close({} as Gateway)}
            className="flex-grow flex justify-center bg-red-100 border-red-900 hover:bg-red-200"
          >
            Batalkan
          </BasicButton>
        </div>
      </form>
    </div>
  );
};

export const SeeCredentials = (props: { data: MqttCredential }) => {
  const popup = usePopup()
  return (
    <div className="bg-white max-w-lg p-5 rounded">
      <h3 className="flex items-center gap-4 mb-5">
        <span className="p-2 bg-blue-100 rounded">
          <Eye className="size-2" />
        </span>
        Kredensial MQTT
      </h3>
      <div className="w-80">
        <div className="mb-2">
          <p className="text-sm text-gray-800">ID Gateway</p>
          <p className="py-2 flex gap-2"><div className="border-2 border-solid border-blue-100 rounded"></div>{props.data.gateway_id}</p>
        </div>
        <div className="mb-2">
          <p className="text-sm text-gray-800">Topic Data</p>
          <p className="py-2 flex gap-2"><div className="border-2 border-solid border-blue-100 rounded"></div>{props.data.topic_data}</p>
        </div>
        <div className="mb-2">
          <p className="text-sm text-gray-800">Topic Action</p>
          <p className="py-2 flex gap-2"><div className="border-2 border-solid border-blue-100 rounded"></div>{props.data.topic_action}</p>
        </div>
        <div className="p-2 bg-red-100 rounded">
          <p className="text-sm my-2">Credentials</p>
          <div className="bg-white/70 rounded p-2">
            <div className="mb-2">
              <p className="text-sm text-gray-800">Username</p>
              <p className="py-2 flex gap-2"><div className="border-2 border-solid border-blue-100 rounded"></div>{props.data.credential[0]}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-800">Password</p>
              <p className="py-2 flex gap-2"><div className="border-2 border-solid border-blue-100 rounded"></div>{props.data.credential[1]}</p>
            </div>
          </div>
        </div>
        <BasicButton onClick={() => popup.close({})} className="bg-black text-white mt-5 w-full justify-center">Tutup</BasicButton>
      </div>
    </div>
  );
};
