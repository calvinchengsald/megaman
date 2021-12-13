

const Connect = (props) => {
    console.log(props)
    return(
        <div className="chat-container">
            <form onSubmit={props.connectToServer}>
            <input
                autoFocus value={props.displayName} placeholder="Display Name"
                onChange={(e) => {
                    props.setDisplayName(e.currentTarget.value);
                }}
            />
            </form>
    </div>
  )
}

export default Connect
