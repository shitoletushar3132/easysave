import { useEffect, useState } from "react";
import { sharedFiles, updateAccessiblity } from "../requests/public";
import { Unlock, FileIcon, ExternalLink, AlertTriangle } from "lucide-react";
import Loader from "../components/Loader";
import { useRecoilState } from "recoil";
import { RefreshAtom } from "../store/atomAuth";

const Settings = () => {
  const [files, setFiles] = useState<
    {
      fileId: string;
      name: string;
      url: string;
      type: string;
      key: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useRecoilState(RefreshAtom);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sharedFiles();
      if (!Array.isArray(data))
        throw new Error("Invalid data format received.");
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setError("Failed to load files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "settings";
    fetchData();
  }, [refresh]);

  const toggleAccess = async (fileId: string, key: string) => {
    try {
      const resp = await updateAccessiblity(fileId, key, setRefresh);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <Loader />
          <p className="mt-2 text-base-content/70">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="mt-2 text-red-600 font-semibold">{error}</p>
          <button onClick={fetchData} className="mt-4 btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-base-content">
              File Access Management
            </h2>
            <p className="mt-2 text-base-content/70">
              Manage access permissions for your shared files
            </p>
          </div>
        </div>

        <div className="bg-base-200 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-base-300">
                <thead>
                  <tr className="bg-base-300">
                    <th scope="col" className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                        File Details
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="py-4 px-6 text-left hidden sm:table-cell"
                    >
                      <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                        Type
                      </span>
                    </th>
                    <th scope="col" className="py-4 px-6 text-left">
                      <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                        URL
                      </span>
                    </th>
                    <th scope="col" className="py-4 px-6 text-right">
                      <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {files?.length > 0 ? (
                    files.map((file) => (
                      <tr
                        key={file.fileId}
                        className="hover:bg-base-300/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <FileIcon className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-base-content">
                                {file.name}
                              </div>
                              <div className="text-sm text-base-content/70 sm:hidden">
                                {file.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center text-sm text-primary hover:text-primary-focus"
                            >
                              <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                                {file.url}
                              </span>
                              <ExternalLink className="ml-1.5 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => toggleAccess(file.fileId, file.key)}
                            className="btn btn-primary btn-sm md:btn-md"
                          >
                            <Unlock className="h-4 w-4 mr-1.5" />
                            <span className="hidden sm:inline">
                              Make Private
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <FileIcon className="mx-auto h-12 w-12 text-base-content/40" />
                        <h3 className="mt-2 text-sm font-medium text-base-content">
                          No files
                        </h3>
                        <p className="mt-1 text-sm text-base-content/70">
                          No shared files are available at the moment
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
