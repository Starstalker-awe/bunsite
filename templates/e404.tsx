import Base from "./base";

export default function e404() {
    return (
        <Base header={true} footer={false} title="404">
            <div class="justify-center xl:p-64 text-center">
                <h1 class="text-6xl">🚧</h1><br />
                <h2 class="text-xl">This Page Doesn't Exist</h2>
            </div>
        </Base>
    )
}