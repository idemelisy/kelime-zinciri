type GoalBarProps={

    start:string

    target:string

}

export default function GoalBar({

    start,

    target

}:GoalBarProps){

    return(

        <section className="goal-bar">

            <div className="goal-word">

                {start}

            </div>

            <div className="goal-arrow">

                →

            </div>

            <div className="goal-word target">

                {target}

            </div>

        </section>

    )

}