import { Transitions } from "@/components/rgm/transitions";

export default function GabaritSite({ children }: { children: React.ReactNode }) {
  return <Transitions>{children}</Transitions>;
}
