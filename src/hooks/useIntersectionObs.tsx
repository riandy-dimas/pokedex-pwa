import { useEffect } from "react";

type TUseIntersectionObs = {
  target: React.MutableRefObject<HTMLUListElement | null>
  onIntersecting: () => void
}
const useIntersectionObs = ({
  target,
  onIntersecting,
}: TUseIntersectionObs) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log(entry);

        if (entry.isIntersecting) {
          //do your actions here
          onIntersecting();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );
    if (target.current) {
      observer.observe(target.current);
    }
  }, [target, onIntersecting]);
}
export default useIntersectionObs;