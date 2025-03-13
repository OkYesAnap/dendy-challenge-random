import { getGamesList } from "@/utils/getGamesList";
import MainPage from "./main";

export default async function  Home() {
  const serverProps = await getGamesList();
  return (
    <MainPage {...{serverProps}}/>
  );
}
