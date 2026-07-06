type HeaderProps = {
    title:string
    subtitle:string
}

export default function Header({
    title,
    subtitle
}:HeaderProps){

    return(

        <header className="game-header">

            <h1>{title}</h1>

            <p>{subtitle}</p>

        </header>

    )

}