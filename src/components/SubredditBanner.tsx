
import SubInfoModal from "./SubInfoModal";

import { useState, useEffect } from "react";
import { useSubsContext } from "../MySubs";
import router, { useRouter } from "next/router";
import SubPills from "./SubPills";
import SubCard from "./views/SubCard";

const SubredditBanner = ({ subreddits, userMode }) => {
  const router = useRouter();
  const subsContext: any = useSubsContext();
  const { currSubInfo, loadCurrSubInfo, multi } = subsContext;
  const [currSubData, setCurrSubData] = useState<any>({});
  const [subreddit, setSubreddit] = useState("");
  const [multiSub, setMultiSub] = useState("");
  const [currMulti, setCurrMulti] = useState("");
  const [subArray, setSubArray] = useState([]);
  const [keepInMultiArray, setKeepInMultiArray] = useState(false);

  const [openDescription, setOpenDescription] = useState(0);
 



  //entry point
  useEffect(() => {
    let s = subreddits.sort((a, b) => {
      let aUpper = a.toUpperCase();
      let bUpper = b.toUpperCase();
      if (aUpper < bUpper) return -1;
      if (aUpper > bUpper) return 1;
      return 0;
    });
    setSubreddit(s?.[0]);
    if (
      !keepInMultiArray ||
      subreddits?.length > 1 ||
      subreddits?.[0].toUpperCase() !== multiSub.toUpperCase()
    ) {
      setSubArray(s);
      setCurrMulti(multi);
      setKeepInMultiArray(false);
    }
  }, [subreddits]);


  useEffect(() => {
    if (multi) {
      setCurrMulti(multi);
    } else {
      setCurrMulti("");
    }
  }, [multi]);

  const goToMulti = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMultiSub("");
    router.push(`${subArray.join("+")}${currMulti ? `?m=${currMulti}` : ""}`);
  };

  const goToMultiSub = (e, s) => {
    e.preventDefault();
    e.stopPropagation();
    setMultiSub(s);
    setKeepInMultiArray(true);
    //console.log(router);
    let query = [];
    for (let q in router.query) {
      if (q !== "slug") {
        query.push(`${q}=${router.query[q]}`);
      }
    }
    if (router.route === "/r/[...slug]") {
      router.push(s + (query?.length > 0 ? `?${query.join("&")}` : ""));
    } else {
      router.push(`/r/${s}`, `/r/${s}`);
    }
  };

  const removeSub = (s) => {
    if (router.route === "/r/[...slug]") {
      let curr: string = router.query.slug[0];
      let currsubs = curr.split("+");
      let filtered = currsubs.filter(
        (c) => c.toUpperCase() !== s.toUpperCase()
      );
      let filteredSubAry = subArray.filter(
        (c) => c.toUpperCase() !== s.toUpperCase()
      );
      setSubArray((c) =>
        c.filter((sub) => sub.toUpperCase() !== s.toUpperCase())
      );
      //console.log(currsubs);
      if (filtered.length > 1) {
        router.push(`/r/${filtered.join("+")}`);
      } else if (filteredSubAry.length > 0) {
        router.push(`/r/${filteredSubAry.join("+")}`);
      } else {
        router.push("/");
      }
    }
  };

  const toggleOpenDescription = () => {
    setOpenDescription(p => p+1)
  }

  return (
      
      <div
        className={
          "w-full h-full -mt-2 relative  " +
          (subArray.length === 1 && multi === ""
            ? " mb-2  md:mb-4 lg:mb-6"
            : " space-y-2 mb-2 md:space-y-3 md:mb-3  ")
        }
      >
        <SubInfoModal
        toOpen={openDescription}
        descriptionHTML={currSubData?.description_html}
        displayName={currSubData?.display_name_prefixed}
      />
         <SubCard data={currSubInfo} link={false} tall={true} subInfo={currSubData}
                        currMulti={currMulti}
                        subArray={subArray}
                        openDescription={toggleOpenDescription}/>
        
         

        {(multi || subArray.length > 1 || currMulti) && (
          <SubPills
            subArray={subArray}
            currMulti={currMulti}
            multiSub={multiSub}
            goToMulti={goToMulti}
            goToMultiSub={goToMultiSub}
            removeSub={removeSub}
          />
        )}
      </div>
  );
};

export default SubredditBanner;
