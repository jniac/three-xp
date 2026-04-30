import { Space } from 'some-utils-ts/experimental/layout/flex'
import { computeLayout4 } from 'some-utils-ts/experimental/layout/flex/computeLayout-4'

class Layout {
  tags: string[]
  constructor(
    public key: string,
    tags: string,
    public name: string,
    public description: string,
    public size: [number, number],
    public props: Record<string, any>,
    public getRoots: (size: [number, number]) => Space[],
  ) {
    this.tags = tags.split(/\s+/)
  }

  static utils = {
    fourQuadrants(size: [number, number], {
      rootPadding = 50,
      spacing = 10,
    } = {}) {
      const [w, h] = size
      const root = new Space({
        size: [w - rootPadding * 2, h - rootPadding * 2],
        offset: rootPadding,
        padding: spacing,
        direction: 'vertical',
      })
        .add(
          new Space({ userData: { skipDraw: true } }).add(
            new Space({ name: 'quadrant', spacing }),
            new Space({ name: 'quadrant', spacing }),
          ),
          new Space({ userData: { skipDraw: true } }).add(
            new Space({ name: 'quadrant', spacing }),
            new Space({ name: 'quadrant', spacing }),
          ),
        )
      const quadrants = root.findAll(s => s.name === 'quadrant').toArray()
      return [root, quadrants] as const
    },
  }
}


const basic1 = new Layout(
  'basic1',
  'basic',
  'Basic Layout',
  `
    - Absolute and proportional sizes
  `,
  [800, 600],
  { drawDirection: true },
  () => [
    new Space({ size: [600, 200], offset: [100, 100 - 10], spacing: 10 }).add(
      new Space({ size: 100 }),
      new Space({ size: 50 }),
      new Space({ size: 50 }),
    ),
    new Space({ size: [600, 200], offset: [100, 300 + 10], spacing: 10 }).add(
      new Space({ size: ['25%', '25%'] }),
      new Space({ size: ['25%', '50%'] }),
      new Space({ size: ['25%', '75%'] }),
    ),
  ],
)

const fractional1 = new Layout(
  'fractional1',
  'fractional',
  'Fractional Layout 1',
  `
    - Fractional sizes
  `,
  [800, 600],
  { drawDirection: true },
  () => [
    new Space({
      size: [600, 400],
      offset: [100, 100],
      spacing: 10,
      direction: 'vertical',
    })
      .add(
        new Space({ spacing: 10 })
          .add(
            new Space({ size: '1fr' }).populate(1, { size: 20 }),
            new Space({ size: '2fr' }).populate(1, { size: 20 }),
            new Space({ size: '3fr' }).populate(1, { size: 20 }),
          ),
        new Space({ spacing: 10 }).add(
          new Space({ size: '9fr' }).populate(1, { size: 20 }),
          new Space({ size: '3fr' }).populate(1, { size: 20 }),
          new Space({ size: '1fr' }).populate(1, { size: 20 }),
        ),
      )
  ],
)

const align1 = new Layout(
  'align1',
  'align',
  'Align 1',
  `
    - align
    - alignChildren
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const spacing = 10
    return [
      new Space({
        size: [700, 500],
        offset: [50, 50],
        spacing,
        direction: 'vertical',
      })
        .add(
          new Space({ spacing, size: '3fr' })
            .add(
              new Space({ spacing, direction: 'vertical', sizeY: '50%', align: 0, alignChildren: 0 })
                .populate(2, { sizeY: '20%' }),
              new Space({ spacing, direction: 'vertical', sizeY: '50%' })
                .populate(2, { sizeY: '20%' }),
              new Space({ spacing, direction: 'vertical', sizeY: '50%', align: 1, alignChildren: 1 })
                .populate(2, { sizeY: '20%' }),
            ),
          new Space({ spacing, size: '2fr', direction: 'vertical' })
            .add(
              new Space({ spacing, sizeX: '50%', align: 0, alignChildren: 0 })
                .populate(2, { sizeX: '20%' }),
              new Space({ spacing, sizeX: '50%' })
                .populate(2, { sizeX: '20%' }),
              new Space({ spacing, sizeX: '50%', align: 1, alignChildren: 1 })
                .populate(2, { sizeX: '20%' }),
            ),
        )
    ]
  },
)

const padding1 = new Layout(
  'padding1',
  'padding',
  'Padding',
  `
    - 4 different padding values on each side
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const padding = ['2%', '4%', '8%', '16%']
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
      padding,
      direction: 'horizontal',
    })
    let current = root
    for (let i = 0; i < 16; i++) {
      const child = new Space({ padding })
      current.add(child)
      current = child
    }
    return [root]
  },
)

const padding2 = new Layout(
  'padding2',
  'padding',
  'Negative Padding',
  `
    - In contrast with CSS, negative padding (-30 on left, [-60, 30] on right) is allowed and behaves as a reverse spacing, making children overlap each other and the parent border.
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
      direction: 'horizontal',
      gap: 10,
    }).populate(3, { size: 200 })

    root.childAt(0)!.set({
      padding: -30,
    }).add(
      new Space({ padding: -5 }).add(
        new Space({ padding: -5 }).add(
          new Space({ padding: -5 }).add(
            new Space({ padding: -5 }).add(
              {}
            ),
          ),
        ),
      ),
    )

    root.childAt(2)!.set({
      padding: [-60, 30],
    }).add(
      new Space({ padding: -5 }).add(
        new Space({ padding: -5 }).add(
          new Space({ padding: -5 }).add(
            new Space({ padding: -5 }).add(
              {}
            ),
          ),
        ),
      ),
    )

    return [root]
  },
)

const fitContent1 = new Layout(
  'fitContent1',
  'fit-content',
  'Fit Content',
  `
    - Easy fit
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const spacing = 10

    const roots = [
      new Space({
        size: [700, 240],
        offset: [50, 50],
        spacing,
        direction: 'horizontal',
      })
        .add(
          new Space({
            size: 'fit-content',
            // alignChildren: 1,
            spacing,
          })
            .add(
              new Space({ size: [100, 50] }),
              new Space({ size: [50, 100] }),
              new Space({ size: [100, 50] }),
            ),
        ),
      new Space({
        size: [700, 240],
        offset: [50, 240 + 20 + 50],
        spacing: 10,
        direction: 'horizontal',
      })
        .add(
          new Space({ size: 'fit-content', alignChildren: 1, spacing: 10 }).add(
            new Space({ size: [100, 50] }),
            new Space({ size: [50, 100] }),
            new Space({ size: [100, 50] }),
          ),
          new Space({ spacing: 10 }).populate(3),
        ),
    ]

    return roots
  },
)

const fitContent2 = new Layout(
  'fitContent2',
  'fit-content',
  'Nested Fit-Content',
  `
    - No matter the direction.
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
    })

    const count = 16
    const spacing = 10
    const size = 'fit-content'

    let current = root
    for (let i = 0; i < count; i++) {
      const child = new Space({ size, spacing, direction: i % 2 ? 'vertical' : 'horizontal' })
      current.add(child)
      current = child
    }

    current.add(
      new Space({ size: [100, 10] }),
      new Space({ size: [100, 10] }),
    )

    return [root]
  },
)

const fitContent3 = new Layout(
  'fitContent3',
  'fit-content',
  'Fit-Content On One Axis',
  `
    - When only one axis is "fit-content"
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const spacing = 10
    const [root, quadrants] = Layout.utils.fourQuadrants(size, { spacing })
    const [q1, q2, q3, q4] = quadrants
    q1.set({ spacing })
      .add(
        new Space({ spacing: 10, direction: 'horizontal', size: ['fit-content', 'auto'] }).add(
          new Space({ size: [60, 30] }),
          new Space({ size: [30, 60] }),
          new Space({ size: [30, 30] }),
        )
      )
    q2.set({ spacing })
      .add(
        new Space({ spacing: 10, direction: 'vertical', size: ['fit-content', 'auto'] }).add(
          new Space({ size: [60, 30] }),
          new Space({ size: [30, 60] }),
          new Space({ size: [30, 30] }),
        )
      )
    q3.set({ spacing })
      .add(
        new Space({ spacing: 10, direction: 'horizontal', size: ['auto', 'fit-content'] }).add(
          new Space({ size: [60, 30] }),
          new Space({ size: [30, 60] }),
          new Space({ size: [30, 30] }),
        )
      )
    q4.set({ spacing })
      .add(
        new Space({ spacing: 10, direction: 'vertical', size: ['auto', 'fit-content'] }).add(
          new Space({ size: [60, 30] }),
          new Space({ size: [30, 60] }),
          new Space({ size: [30, 30] }),
        )
      )
    return [root]
  },
)

const overflow1 = new Layout(
  'overflow1',
  'overflow',
  'Overflow',
  `
    - When content overflows the container
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const spacing = 4
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
      gap: 80,
      padding: [80],
    })
      .add(
        new Space({ spacing, alignChildren: 0 })
          .populate(1, { size: 80 })
          .add(
            new Space({ size: '1fr' }),
            new Space({ size: '1fr' }),
          )
          .populate(1, { size: 80 })
        ,
        new Space({ spacing, alignChildren: .5 })
          .populate(1, { size: 80 })
          .add(
            new Space({ size: '1fr' }),
            new Space({ size: '1fr' }),
          )
          .populate(1, { size: 80 })
        ,
        new Space({ spacing, alignChildren: 1 })
          .populate(1, { size: 80 })
          .add(
            new Space({ size: '1fr' }),
            new Space({ size: '1fr' }),
          )
          .populate(1, { size: 80 })
        ,
      )
    return [root]
  },
)

const stressTest1 = new Layout(
  'stressTest1',
  'stress-test',
  'Stress Test 1',
  `
    - Up to 9 levels of nesting
  `,
  [1200, 1200],
  { randomColors: true, drawMode: 2 },
  size => {
    const [w, h] = size
    const spacing = 3
    const root = new Space({
      offset: [50, 50],
      size: [w - 100, h - 100],
      spacing,
    })
    const countSequence = [2, 3, 1, 4, 3, 2, 2, 3, 5]
    const sizeSequence = [`2fr`, `3fr`] as any[]
    let step = 0
    let subStep = 0
    let queue = [root]
    let nextQueue: Space[] = []
    while (step < 9) {
      const direction = step % 2 === 0
      const count = countSequence[subStep % countSequence.length]
      for (const current of queue) {
        current.populate(count, { spacing, direction })
        nextQueue.push(...current.children)
        for (const child of current.children) {
          const size = sizeSequence[subStep % sizeSequence.length]
          child.set({ size })
          subStep++
        }
      }
      queue = nextQueue
      nextQueue = []
      step++
    }
    return [root]
  },
)

const aspect1 = new Layout(
  'aspect1',
  'aspect',
  'Aspect Ratio',
  `
    - One space with aspect ratio with alignment variations
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const [root, quadrants] = Layout.utils.fourQuadrants(size)
    const [q1, q2, q3, q4] = quadrants
    const pr = 3
    q1.set({ alignChildren: 0 }).add({ aspect: pr })
    q2.set({ alignChildren: 1 }).add({ aspect: 1 / pr })
    q3.set({ alignChildren: 1, direction: 'vertical' }).add({ aspect: pr })
    q4.set({ alignChildren: 0, direction: 'vertical' }).add({ aspect: 1 / pr })
    return [root]
  },
)

const aspect2 = new Layout(
  'aspect2',
  'aspect',
  'Aspect Distribution',
  `
    - Cohabitation of aspect and fractional spaces.
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const spacing = 10
    const [w, h] = size
    const root = new Space({
      size: [w - 100, h - 100],
      offset: 50,
      padding: ['10%', 10],
    })
      .add(
        new Space({ spacing, userData: { drawQuadrant: .5 } })
          .add(
            new Space({ aspect: 2 }),
            new Space({ aspect: 1 / 2 }),
            new Space({}),
            new Space({ aspect: 2 }),
            new Space({ aspect: 1 / 2 }),
          )
        ,
        new Space({ spacing, direction: 'vertical', userData: { drawQuadrant: .5 } })
          .add(
            new Space({ aspect: 2 }),
            new Space({ aspect: 1 / 2 }),
            new Space({}),
            new Space({}),
          )
        ,
      )
    root.findAll(s => s.depth() === 2)
      .forEach(s => s.set({ userData: { drawCenter: true } }))
    return [root]
  },
)

const aspect3 = new Layout(
  'aspect3',
  'aspect',
  'Aspect Distribution',
  `
    - When direction matters
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const spacing = 10
    const [root, quadrants] = Layout.utils.fourQuadrants(size)
    for (const q of quadrants) {
      q.set({ spacing })
    }
    const [q1, q2, q3, q4] = quadrants
    q1.set({ alignChildren: 0 }).add(
      new Space({ aspect: 4 }),
      new Space({ aspect: 1 }),
      new Space({ aspect: 1 / 4 }),
    )
    q2.set({ alignChildren: 1, direction: 'vertical' }).add(
      new Space({ aspect: 4 }),
      new Space({ aspect: 1 }),
      new Space({ aspect: 1 / 4 }),
    )
    q3.add(
      new Space({ aspect: 1 / 4 }),
      new Space({}),
      new Space({ aspect: 1 / 4 }),
    )
    q4.set({ direction: 'vertical' }).add(
      new Space({ aspect: 4 }),
      new Space({}),
      new Space({ aspect: 4 }),
    )
    root.setAll(s => s.isLeaf(), { userData: { drawCenter: true } })
    computeLayout4(root)
    return [root]
  },
)

const aspect4 = new Layout(
  'aspect4',
  'aspect',
  'Aspect Distribution',
  `
    - Cohabitation of aspect and fixed spaces.
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const [root, quadrants] = Layout.utils.fourQuadrants(size)
    const [q1, q2, q3, q4] = quadrants
    for (const q of quadrants) {
      q.set({ spacing: 10 })
    }
    q1.add(
      new Space({ aspect: 4 }),
      new Space({ aspect: 1 }),
      new Space({ size: 50 }),
    )
    q2.add(
      new Space({ size: 50 }),
      new Space({ aspect: 1 / 4 }),
    )
    q3.add(
      new Space({ aspect: 1 }),
      new Space({}),
      new Space({ spacing: 10, size: 'fit-content', direction: 'vertical' }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
    )
    q4.set({ direction: 'vertical' }).add(
      new Space({ aspect: 2 }),
      new Space({ spacing: 10, size: 'fit-content' }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
      new Space({ aspect: 2 }),
    )
    root.setAll(s => s.isLeaf(), { userData: { drawCenter: true } })
    return [root]
  },
)

const aspect5 = new Layout(
  'aspect5',
  'aspect',
  'Aspect Auto vs Aspect With Constraint',
  `
    - When aspect ratio handling has to deal with one constrained size and one free size
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const [root, quadrants] = Layout.utils.fourQuadrants(size, { spacing: 4 })
    const aspects = [2, 1, 1 / 4, 1 / 8]
    const [q1, q2, q3, q4] = quadrants
    q1.add(
      ...aspects.map(aspect => new Space({ aspect })),
    )
    q2.add(
      ...aspects.map(aspect => new Space({ aspect, sizeX: '15%' })),
    )
    q3.set({ direction: 'vertical' }).add(
      ...aspects.map(aspect => new Space({ aspect: 1 / aspect })),
    )
    q4.set({ direction: 'vertical' }).add(
      ...aspects.map(aspect => new Space({ aspect: 1 / aspect, sizeY: '15%' })),
    )
    q2.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b10 } })
    q4.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b10 } })
    return [root]
  },
)

const aspect6 = new Layout(
  'aspect6',
  'aspect',
  'Aspect With Constraint on Size X or Size Y',
  `
    - "sizeX" constraint on the left, "sizeY" constraint on the right.
    - When aspect ratio is constrained on one axis, an overflow is likely to occur.
  `,
  [800, 600],
  { drawDirection: false },
  size => {
    const [root, quadrants] = Layout.utils.fourQuadrants(size, { spacing: 4 })
    const aspects = [2, 1, 1 / 4, 1 / 8]
    const [q1, q2, q3, q4] = quadrants
    q1.add(
      ...aspects.map(aspect => new Space({ aspect, sizeX: '20%' })),
    )
    q2.add(
      ...aspects.map(aspect => new Space({ aspect, sizeY: '35%' })),
    )
    q3.set({ direction: 'vertical' }).add(
      ...aspects.map(aspect => new Space({ aspect: 1 / aspect, sizeX: '25%' })),
    )
    q4.set({ direction: 'vertical' }).add(
      ...aspects.map(aspect => new Space({ aspect: 1 / aspect, sizeY: '20%' })),
    )
    q1.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b10 } })
    q2.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b01 } })
    q3.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b10 } })
    q4.setAll(s => s.depth() === 3, { userData: { drawSizeBars: 0b01 } })
    return [root]
  },
)

const aspect7 = new Layout(
  'aspect7',
  'aspect',
  'Aspect And Fit-Content',
  `
    - It works out of the box with fit-content!!! 🍾
  `,
  [800, 600],
  { drawDirection: true },
  size => {
    const [root, quadrants] = Layout.utils.fourQuadrants(size, { spacing: 4 })
    const aspects = [2, 1, 1 / 4, 1 / 8]
    const [q1, q2, q3, q4] = quadrants
    q1.add(
      new Space({ aspect: 1, sizeX: 'fit-content', spacing: 10 }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
    )
    q2.add(
      new Space({ aspect: 1, sizeY: 'fit-content', spacing: 10 }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
    )
    q3.add(
      new Space({ aspect: 1, sizeX: 'fit-content', spacing: 10 }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
      new Space({ aspect: 1 }),
    )
    q4.add(
      new Space({}),
      new Space({ aspect: 1 / 4 }),
      new Space({ aspect: 1, sizeY: 'fit-content', spacing: 10, alignChildren: 0 }).add(
        new Space({ size: 50 }),
        new Space({ size: 50 }),
        new Space({ size: 50 }),
      ),
      new Space({ aspect: 1 }),
      new Space({}),
    )
    return [root]
  },
)

const absolute1 = new Layout(
  'absolute1',
  'absolute',
  'Absolute Spaces',
  `
    - Spaces can be absolutely positioned: they don't take part in the layout and are just placed on top of it according to their offset and size options.
    - By default absolute spaces totally fit their parent size, acting like kindof layers (equivalent to "position: absolute; inset: 0;" in CSS)
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const spacing = 10
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
      positioning: 'absolute',
      spacing,
    })
      .add(
        new Space({ size: 300 }).add(
          new Space({ positioning: 'absolute', align: 0, offset: 50 }),
          new Space({ positioning: 'absolute', align: 0, size: 80, offset: 10 }),
          new Space({ positioning: 'absolute', align: 1, size: 80, offset: -10 }),
        ),
      )
    return [root]
  },
)

const absolute2 = new Layout(
  'absolute2',
  'absolute align',
  'Absolute & Align',
  `
  `,
  [800, 600],
  { drawDirection: true },
  () => {
    const spacing = 10
    const root = new Space({
      size: [700, 500],
      offset: [50, 50],
      positioning: 'absolute',
      spacing,
    })
      .add(
        new Space({ size: 300, padding: 10 }).add(
          new Space({ positioning: 'absolute', align: 0, size: 80 }),
          new Space({ positioning: 'absolute', align: 1, size: 80 }),
        ),
        new Space({ size: 300, padding: 10 }).add(
          new Space({ positioning: 'absolute', align: 0, size: 80 }),
          new Space({ positioning: 'absolute', align: 1, size: 80 }),
        ),
      )
    return [root]
  },
)

export const layouts: Layout[] = [
  basic1,
  fractional1,
  align1,

  padding1,
  padding2,

  fitContent1,
  fitContent2,
  fitContent3,

  overflow1,

  aspect1,
  aspect2,
  aspect3,
  aspect4,
  aspect5,
  aspect6,
  aspect7,

  absolute1,
  absolute2,

  stressTest1,
]

export const layoutsByTags = new Map<string, Layout[]>()
layoutsByTags.set('all', layouts)
for (const layout of layouts) {
  for (const tag of layout.tags) {
    if (!layoutsByTags.has(tag)) {
      layoutsByTags.set(tag, [])
    }
    layoutsByTags.get(tag)!.push(layout)
  }
}
