import { mapWithSeparator } from 'some-utils-ts/iteration/map-with-separator'

import { Link } from './Link'

export function Menu() {
  const Separator = () => <div className='px-6'>{'|'}</div>
  return (
    <div className='flex row items-center thru'>
      <div className='screen-size-desktop flex row items-center'>
        {mapWithSeparator(['shapes', 'shaders', 'motion', 'interaction'],
          word => <Link key={word} word={word} />,
          ({ index }) => <Separator key={index} />
        )}
      </div>
      <div className='screen-size-mobile'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
      </div>
    </div>
  )
}
