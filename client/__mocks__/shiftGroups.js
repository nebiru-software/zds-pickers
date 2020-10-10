import { SORT_ASC, SORT_BY_ALL, SORT_ON_INPUT } from '../src/reducers/shiftGroup'

export const groupAEntryData = [153, 1, 153, 1, 153, 2, 153, 2, 153, 3, 153, 3, 153, 4, 153, 4]

export const entryData = [
  ...groupAEntryData,
  153,
  5,
  153,
  5,
  153,
  6,
  153,
  6,
  153,
  7,
  153,
  7,
  153,
  8,
  153,
  8,
  153,
  9,
  153,
  9,
  153,
  10,
  153,
  10,
]

export const groupData = [4, 3, 2, 1, 9, 9, 9, 9, 110, 111, 112, 113, ...entryData]

export const group = {
  channel: 9,
  editQueue: {},
  editing: false,
  selectedEntryId: NaN,
  selectedRows: [],
  active: false,
  entries: [
    {
      entryId: 0,
      input: { channel: 9, status: 9, value: 1 },
      output: { channel: 9, status: 9, value: 1 },
    },
    {
      entryId: 1,
      input: { channel: 9, status: 9, value: 2 },
      output: { channel: 9, status: 9, value: 2 },
    },
    {
      entryId: 2,
      input: { channel: 9, status: 9, value: 3 },
      output: { channel: 9, status: 9, value: 3 },
    },
    {
      entryId: 3,
      input: { channel: 9, status: 9, value: 4 },
      output: { channel: 9, status: 9, value: 4 },
    },
  ],
  groupId: 0,
  label: 'Group A',
  value: 110,
  sortOn: SORT_ON_INPUT,
  sortBy: SORT_BY_ALL,
  sortDir: SORT_ASC,
}

export const groups = {
  groups: [
    {
      channel: 9,
      editQueue: {
        entryId: -1,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 0,
          input: { channel: 9, status: 9, value: 1 },
          output: { channel: 9, status: 9, value: 1 },
        },
        {
          entryId: 1,
          input: { channel: 9, status: 9, value: 2 },
          output: { channel: 9, status: 9, value: 2 },
        },
        {
          entryId: 2,
          input: { channel: 9, status: 9, value: 3 },
          output: { channel: 9, status: 9, value: 3 },
        },
        {
          entryId: 3,
          input: { channel: 9, status: 9, value: 4 },
          output: { channel: 9, status: 9, value: 4 },
        },
      ],
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
      groupId: 0,
      label: 'Group A',
      value: 110,
      selectedEntryId: NaN,
      selectedRows: [],
      active: false,
    },
    {
      channel: 9,
      editQueue: {
        entryId: -1,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 0,
          input: { channel: 9, status: 9, value: 5 },
          output: { channel: 9, status: 9, value: 5 },
        },
        {
          entryId: 1,
          input: { channel: 9, status: 9, value: 6 },
          output: { channel: 9, status: 9, value: 6 },
        },
        {
          entryId: 2,
          input: { channel: 9, status: 9, value: 7 },
          output: { channel: 9, status: 9, value: 7 },
        },
      ],
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
      groupId: 1,
      label: 'Group B',
      value: 111,
      selectedEntryId: NaN,
      selectedRows: [],
      active: false,
    },
    {
      channel: 9,
      editQueue: {
        entryId: -1,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 0,
          input: { channel: 9, status: 9, value: 8 },
          output: { channel: 9, status: 9, value: 8 },
        },
        {
          entryId: 1,
          input: { channel: 9, status: 9, value: 9 },
          output: { channel: 9, status: 9, value: 9 },
        },
      ],
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
      groupId: 2,
      label: 'Group C',
      value: 112,
      selectedEntryId: NaN,
      selectedRows: [],
      active: false,
    },
    {
      channel: 9,
      editQueue: {
        entryId: -1,
        input: { channel: 9, status: 9, value: 0 },
        output: { channel: 9, status: 9, value: 0 },
      },
      editing: false,
      entries: [
        {
          entryId: 0,
          input: { channel: 9, status: 9, value: 10 },
          output: { channel: 9, status: 9, value: 10 },
        },
      ],
      sortOn: SORT_ON_INPUT,
      sortBy: SORT_BY_ALL,
      sortDir: SORT_ASC,
      groupId: 3,
      label: 'Group D',
      value: 113,
      selectedEntryId: NaN,
      selectedRows: [],
      active: false,
    },
  ],
  maxEntries: 112,
  selectedGroupIdx: 0,
  totalEntries: 10,
}

export default groups
