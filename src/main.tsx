import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

async function loader() {
  const response = await fetch("/data/indonesia_regions.json");
  const data = await response.json();
  return data;
}

//update
const Page = () => {
  const { provinces, regencies, districts } = useLoaderData() as {
    provinces: any[];
    regencies: any[];
    districts: any[];
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const province = searchParams.get("province") || "";
  const regency = searchParams.get("regency") || "";
  const district = searchParams.get("district") || "";

  const filteredRegencies = regencies.filter(
    (r) => r.province_id === Number(province),
  );

  const filteredDistricts = districts.filter(
    (d) => d.regency_id === Number(regency),
  );

  const selectedProvince = provinces.find((p) => p.id === Number(province));
  const selectedRegency = regencies.find((r) => r.id ===  Number(regency));
  const selectedDistrict = districts.find((d) => d.id ===  Number(district));

  if (!provinces) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg font-bold">Loading.....</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 w-screen min-h-screen">
       <div className="flex flex-col md:flex-row min-h-screen">
         <div className="flex flex-col w-full md:w-80 bg-gray-200">
          <div className="flex items-center justify-center py-10 px-5 gap-2">
            <img
              src="/logo.jpg"
              className="rounded-full w-10 h-10"
              alt="logo"
            />
            <p className="text-3xl font-bold text-gray-800">
              Frontend Assesment
            </p>
          </div>

          <hr className="mx-5" />
          <div className="p-5 space-y-10">
            <p className="text-lg font-semibold text-gray-500">
              Filter wilayah
            </p>

            <div className="space-y-6">
              <div className="space-y-3 text-gray-700">
                <p className="font-bold text-md ">Provinsi</p>
                <select
                  className="w-full border-3 border-gray-700 py-2 px-1 rounded-lg focus:border-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  name="province"
                  value={province}
                  onChange={(e) => {
                    setSearchParams({
                      province: e.target.value,
                    });
                  }}
                >
                  <option value="">--Pilih Provinsi--</option>
                  {provinces.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 text-gray-700">
                <p className="font-bold text-md ">Kota/Kabupaten</p>
                <select
                  className="w-full border-3 border-gray-700 py-2 px-1 rounded-lg focus:border-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  name="regency"
                  value={regency}
                  onChange={(e) => {
                    setSearchParams({
                      province,
                      regency: e.target.value,
                    });
                  }}
                  disabled={!province}
                >
                  <option value="">--Pilih Kota/Kabupaten--</option>
                  {filteredRegencies.map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3 text-gray-700">
                <p className="font-bold text-md ">Kecamatan</p>
                <select
                  className="w-full border-3 border-gray-700 py-2 px-1 rounded-lg focus:border-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  name="district"
                  value={district}
                  onChange={(e) => {
                    setSearchParams({
                      province,
                      regency,
                      district: e.target.value,
                    });
                  }}
                  disabled={!regency}
                >
                  <option value="">--Pilih Kecamatan--</option>
                  {filteredDistricts.map((d) => (
                    <option value={d.id} key={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-10 px-5">
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 text-white rounded-lg py-2 text-sm w-100 sm: mb-5"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full bg-gray-50">
          <nav className="breadcrumb text-md text-gray-400 mb-12 w-full py-5 px-5 bg-white">
            Indonesia
            {selectedProvince && <> › {selectedProvince.name}</>}
            {selectedRegency && <> › {selectedRegency.name}</>}
            {selectedDistrict && <> › {selectedDistrict.name}</>}
          </nav>
          <main className="flex flex-col items-center text-center space-y-12 px-4 md:px-10 py-10">
            <div>
              <p className="text-md tracking-widest text-blue-500 mb-2">
                PROVINSI
              </p>
              <h2 className="text-5xl font-bold text-gray-800">
                {selectedProvince ? selectedProvince.name : "-"}
              </h2>
            </div>

            <div>
              <p className="text-md tracking-widest text-blue-500 mb-2">
                KOTA / KABUPATEN
              </p>
              <h2 className="text-4xl font-semibold text-gray-800">
                {selectedRegency ? selectedRegency.name : "-"}
              </h2>
            </div>

            <div>
              <p className="text-md tracking-widest text-blue-500 mb-2">
                KECAMATAN
              </p>
              <h2 className="text-3xl font-medium text-gray-800">
                {selectedDistrict ? selectedDistrict.name : "-"}
              </h2>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
    loader,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
