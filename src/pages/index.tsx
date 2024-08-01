import React, { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
import { api } from '@/utils/client/api'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

type TabStatus = 'all' | 'pending' | 'completed'
interface TabDataProps {
  children: React.ReactNode
  listNameTab: TabStatus[]
  tabActive: TabStatus
  setTabActive: (value: TabStatus) => void
}

const Index = () => {
  const listNameTab: TabStatus[] = ['all', 'pending', 'completed']
  const [tabActive, setTabActive] = useState<TabStatus>('all')
  const { data: todosData = [] } = api.todo.getAll.useQuery({
    statuses: tabActive === 'all' ? ['completed', 'pending'] : [tabActive],
  })
  const filteredTodos = todosData.filter(
    (todo) => tabActive === 'all' || todo.status === tabActive
  )

  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>

        <div className="pt-10">
          <TabData
            listNameTab={listNameTab}
            tabActive={tabActive}
            setTabActive={setTabActive}
          >
            <Tabs.TabsContent value={tabActive}>
              {filteredTodos.length > 0 ? (
                <TodoList todos={filteredTodos} tabActive={tabActive} />
              ) : (
                <div className="text-center">No data</div>
              )}
            </Tabs.TabsContent>
          </TabData>
        </div>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

const TabData = ({
  children,
  listNameTab,
  tabActive,
  setTabActive,
}: TabDataProps) => {
  return (
    <Tabs.Root
      defaultValue={tabActive}
      value={tabActive}
      onValueChange={(value) => setTabActive(value as TabStatus)}
      className="w-full space-y-8"
    >
      <Tabs.List className={`flex gap-3`}>
        {listNameTab &&
          listNameTab?.map((nameTab: TabStatus) => (
            <Tabs.Trigger
              key={nameTab}
              value={nameTab}
              className={`rounded-full px-6 py-3 font-medium capitalize ${
                tabActive === nameTab
                  ? 'bg-[#334155]  text-white'
                  : 'border border-gray-300 bg-white text-gray-900'
              }`}
            >
              {nameTab}
            </Tabs.Trigger>
          ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  )
}
export default Index
