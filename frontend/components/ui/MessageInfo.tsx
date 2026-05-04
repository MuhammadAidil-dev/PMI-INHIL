export const MessageInfo = ({ text }: { text: string }) => {
  return (
    <div className="w-full border border-foreground py-2 flex items-center">
      {text}
    </div>
  );
};
