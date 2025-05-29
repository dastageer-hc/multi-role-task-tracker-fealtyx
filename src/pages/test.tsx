import { Typography } from "@/components/core-ui/typography";

const tones = [
  "default",
  "muted",
  "accent",
  "danger",
  "success",
  "white",
] as const;

const variants = [
  "display",
  "h1",
  "h2",
  "h3",
  "body-lg",
  "body",
  "body-sm",
  "label",
  "code",
  "chip",
  "tooltip",
] as const;

export const TypographyShowcase = () => {
  return (
    <div className='p-8 space-y-12 bg-white min-h-screen'>
      {variants.map((variant) => (
        <div key={variant}>
          <h2 className='text-xl font-bold mb-4 capitalize'>
            Variant: {variant}
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
            {tones.map((tone) => (
              <div
                key={tone}
                className='border rounded-md p-4 bg-gray-50 flex items-center justify-center min-h-[64px]'
              >
                {variant === "chip" ? (
                  <div className='inline-flex items-center rounded-full bg-gray-200 px-2 py-1'>
                    <Typography variant='chip' tone={tone} className='truncate'>
                      {tone}
                    </Typography>
                  </div>
                ) : variant === "tooltip" ? (
                  <div className='relative group'>
                    <div className='inline-block rounded bg-gray-100 px-2 py-1 text-sm'>
                      Hover me
                    </div>
                    <div className='absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded bg-black px-2 py-1 text-white opacity-0 group-hover:opacity-100 transition'>
                      <Typography
                        variant='tooltip'
                        tone={tone}
                        className='text-white'
                      >
                        {tone} tooltip
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography
                    variant={variant}
                    tone={tone}
                    className='truncate'
                  >
                    {variant} - {tone}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      // Using colors
      <div className='bg-pale-purple text-tropical-indigo rounded-md p-6 shadow-light'>
        This box uses your palette colors and border radius.
      </div>
      // Using gradients
      <div className='bg-gradient-top-right p-8 rounded-lg text-white'>
        This box has a smooth gradient background.
      </div>
      // Button example
      <button className='bg-medium-slate-blue hover:bg-tropical-indigo text-white px-4 py-2 rounded-md shadow-medium transition-colors duration-300'>
        Click Me
      </button>
    </div>
  );
};
