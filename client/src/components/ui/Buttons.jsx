/* src/components/Buttons.jsx */

export function PrimaryButton({ editStyle = "", title, ...rest }) {
  return (
    <div
      className={`
        text-black
        bg-[#eeeeee] 
        rounded-xl  cursor-pointer
        hover:bg-[#CFCFCF] transition ${editStyle}
      `}
      {...rest}
    >
      {title}
    </div>
  );
}

export function SecondaryButton({ editStyle = "", title, ...rest }) {
  return (
    <div
      className={`
        text-white
        bg-[#333]
        rounded-xl
        hover:bg-black cursor-pointer transition ${editStyle}
      `}
      {...rest}
    >
      {title}
    </div>
  );
}

export function DangerButton({ editStyle = "", title, ...rest }) {
  return (
    <div
      className={`
      text-white
      bg-gray-500
      rounded-xl cursor-pointer
      hover:bg-gray-700 transition ${editStyle}
      `}
      {...rest}
    >
      {title}
    </div>
  );
}
