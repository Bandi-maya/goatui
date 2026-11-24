import ButtonFamily from "@/components/catalog/ButtonFamily";

export const metadata = { title: "GOAT UI lab: buttons in context" };

export default function Page() {
  return (
    <div className="bf-page">
      <div className="bf-masthead">
        <h1>Thirty buttons, eight places they actually live.</h1>
        <p>
          Every control below works: press it, hold it, tab to it. Springs and physics throughout, quiet ink by
          default while the accent color is still undecided.
        </p>
      </div>
      <ButtonFamily />
    </div>
  );
}
