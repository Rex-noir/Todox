import React, { useState, useCallback, useRef, useEffect } from "react";
import { format, addDays, differenceInDays, startOfDay } from "date-fns";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { outerElementType } from "@/components/custom/OuterElementType";
import { useTodoxStore } from "@/stores/todox/todoxStore";
import CreateNewTodo from "@/components/custom/CreateNewTodoButton";
import { TodoItem } from "./ViewProject";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const MemoizedCreateNewTodo = React.memo(CreateNewTodo);
const MemoizedTodoItem = React.memo(TodoItem);

const Upcoming: React.FC = () => {
  // Initialize start date to the beginning of today
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()));
  const endDate = addDays(startDate, 365 * 2); // 2 years from start date
  const totalDays = differenceInDays(endDate, startDate);

  // Get tasks from the store
  const tasks = useTodoxStore((state) => Object.values(state.todos));

  const listRef = useRef<List>(null);
  const [collapsedStates, setCollapsedStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Reset the list when tasks or collapsed states change
  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
  }, [tasks, collapsedStates]);

  // Calculate the height of each item in the list
  const calculateItemHeight = useCallback(
    (index: number): number => {
      const date = addDays(startDate, index);
      const dateString = date.toDateString();
      const dayTasks = tasks.filter(
        (task) =>
          task.due_date &&
          startOfDay(new Date(task.due_date)).getTime() === date.getTime(),
      );

      const baseHeight = 100; // Base height for the day container
      const taskHeight = 100; // Height for each task

      const createNewTodoHeight = collapsedStates[dateString] ? 280 : 0;

      return createNewTodoHeight + baseHeight + dayTasks.length * taskHeight;
    },
    [tasks, startDate, collapsedStates],
  );

  const handleCollapseChange = useCallback((date: Date, value: boolean) => {
    setCollapsedStates((prev) => {
      const newState = { ...prev, [date.toDateString()]: value };
      return newState;
    });
  }, []);

  // Render each day's content
  const renderDay = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const date = addDays(startDate, index);
      const dayTasks = tasks.filter(
        (task) =>
          task.due_date &&
          startOfDay(new Date(task.due_date)).getTime() === date.getTime(),
      );

      return (
        <div style={style} className="mb-4 w-full border-b p-2">
          <h3 className="text-lg font-semibold">{format(date, "PP")}</h3>
          <div className="pl-4">
            {dayTasks.map((task) => (
              <MemoizedTodoItem key={task.id} todo={task} />
            ))}
            <MemoizedCreateNewTodo
              isCollapsed={collapsedStates[date.toDateString()]}
              onCollapseChange={(isCollapsed) =>
                handleCollapseChange(date, isCollapsed)
              }
              due_date={date}
            />
          </div>
        </div>
      );
    },
    [tasks, startDate, handleCollapseChange, collapsedStates],
  );

  return (
    <div className="flex h-full w-full max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="scroll-m-20 border-b pb-3 text-3xl font-semibold tracking-tight first:mt-0">
          Upcoming Todos
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-fit justify-start text-left font-normal",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date ?? new Date());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <AutoSizer className="!w-full">
        {({ height, width }) => (
          <List
            ref={listRef}
            className="scrollbar-hide"
            height={height}
            itemCount={totalDays + 1} // +1 for the "Upcoming" header
            itemSize={calculateItemHeight}
            width={width}
            overscanCount={5}
            outerElementType={outerElementType}
          >
            {renderDay}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default Upcoming;
