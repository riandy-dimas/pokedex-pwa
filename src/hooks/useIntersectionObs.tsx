import { useEffect } from "react";

type TUseIntersectionObs = {
  target: React.MutableRefObject<HTMLUListElement | null>
  onIntersecting: () => void
  isLoading: boolean
}
const useIntersectionObs = ({
  target,
  onIntersecting,
  isLoading = false,
}: TUseIntersectionObs) => {
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {

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
  }, [target, onIntersecting, isLoading]);
}
export default useIntersectionObs;