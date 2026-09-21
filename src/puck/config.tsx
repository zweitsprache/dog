import type { Config, Data, Slot } from "@puckeditor/core";
import type { CSSProperties } from "react";
import {
  ListeningExercise,
  type ListeningExerciseProps,
} from "@/components/puck/listening-exercise";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export type PageComponents = {
  Heading: {
    text: string;
    level: "h1" | "h2";
  };
  Text: {
    text: string;
  };
  ListeningExercise: ListeningExerciseProps;
  Columns: {
    columns: number;
    column1Width: number;
    column2Width: number;
    column3Width: number;
    column4Width: number;
    gap: number;
    mobileBehavior: "stack" | "keep";
    column1: Slot;
    column2: Slot;
    column3: Slot;
    column4: Slot;
  };
  Button: {
    label: string;
    href: string;
    variant: "default" | "outline" | "secondary" | "destructive";
  };
  Card: {
    title: string;
    description: string;
    content: string;
  };
  Accordion: {
    title: string;
    content: string;
  };
  Tabs: {
    firstLabel: string;
    firstContent: string;
    secondLabel: string;
    secondContent: string;
  };
  Dialog: {
    trigger: string;
    title: string;
    description: string;
  };
};

export const config: Config<PageComponents> = {
  components: {
    Heading: {
      fields: {
        text: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "Heading 1", value: "h1" },
            { label: "Heading 2", value: "h2" },
          ],
        },
      },
      defaultProps: {
        text: "A clear headline",
        level: "h2",
      },
      render: ({ text, level: Level }) => (
        <Level
          className={
            Level === "h1"
              ? "pt-10 pr-8 text-4xl font-extrabold"
              : "px-8 pt-10 text-4xl font-semibold"
          }
        >
          {text}
        </Level>
      ),
    },
    Text: {
      fields: {
        text: { type: "textarea" },
      },
      defaultProps: {
        text: "Add your content here.",
      },
      render: ({ text }) => (
        <p className="max-w-3xl px-8 py-6 text-lg leading-8 text-zinc-600">
          {text}
        </p>
      ),
    },
    ListeningExercise: {
      label: "Listening Exercise",
      fields: {
        exerciseNumber: { type: "text", label: "Exercise number" },
        instruction: { type: "text", label: "Instruction" },
        trueLabel: { type: "text", label: "True label" },
        falseLabel: { type: "text", label: "False label" },
        statements: {
          type: "array",
          label: "Statements",
          arrayFields: {
            text: { type: "textarea", label: "Statement" },
          },
          defaultItemProps: (index) => ({
            text: `Statement ${index + 1}`,
          }),
          getItemSummary: (item, index) =>
            item.text || `Statement ${(index ?? 0) + 1}`,
          min: 1,
          max: 12,
        },
      },
      defaultProps: {
        exerciseNumber: "4",
        instruction: "Hören Sie und kreuzen Sie an: richtig oder falsch?",
        trueLabel: "richtig",
        falseLabel: "falsch",
        statements: [
          { text: "Dalia wohnt jetzt an der Hermannstrasse." },
          { text: "Die Hausnummer ist 9." },
          { text: "Der Nachname ist Jones mit J." },
          { text: "Die Postleitzahl ist 8004." },
        ],
      },
      render: (props) => <ListeningExercise {...props} />,
    },
    Columns: {
      fields: {
        columns: { type: "number", label: "Columns", min: 1, max: 4 },
        column1Width: {
          type: "number",
          label: "Column 1 ratio",
          min: 1,
          max: 12,
        },
        column2Width: {
          type: "number",
          label: "Column 2 ratio",
          min: 1,
          max: 12,
        },
        column3Width: {
          type: "number",
          label: "Column 3 ratio",
          min: 1,
          max: 12,
        },
        column4Width: {
          type: "number",
          label: "Column 4 ratio",
          min: 1,
          max: 12,
        },
        gap: { type: "number", label: "Gap (px)", min: 0, max: 96 },
        mobileBehavior: {
          type: "select",
          label: "Mobile layout",
          options: [
            { label: "Stack columns", value: "stack" },
            { label: "Keep columns", value: "keep" },
          ],
        },
        column1: { type: "slot", disallow: ["Columns"] },
        column2: { type: "slot", disallow: ["Columns"] },
        column3: { type: "slot", disallow: ["Columns"] },
        column4: { type: "slot", disallow: ["Columns"] },
      },
      defaultProps: {
        columns: 2,
        column1Width: 1,
        column2Width: 1,
        column3Width: 1,
        column4Width: 1,
        gap: 24,
        mobileBehavior: "stack",
        column1: [],
        column2: [],
        column3: [],
        column4: [],
      },
      render: ({
        columns,
        column1Width,
        column2Width,
        column3Width,
        column4Width,
        gap,
        mobileBehavior,
        column1: Column1,
        column2: Column2,
        column3: Column3,
        column4: Column4,
      }) => {
        const columnCount = Math.max(1, Math.min(4, Math.round(columns)));
        const widths = [
          column1Width,
          column2Width,
          column3Width,
          column4Width,
        ].slice(0, columnCount);
        const style = {
          "--puck-column-template": widths
            .map((width) => `${Math.max(1, width)}fr`)
            .join(" "),
          "--puck-column-gap": `${Math.max(0, gap)}px`,
        } as CSSProperties;

        return (
          <section
            className={`puck-columns puck-columns--${mobileBehavior}`}
            style={style}
          >
            <Column1 className="puck-column" minEmptyHeight={120} />
            {columnCount >= 2 && (
              <Column2 className="puck-column" minEmptyHeight={120} />
            )}
            {columnCount >= 3 && (
              <Column3 className="puck-column" minEmptyHeight={120} />
            )}
            {columnCount >= 4 && (
              <Column4 className="puck-column" minEmptyHeight={120} />
            )}
          </section>
        );
      },
    },
    Button: {
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Default", value: "default" },
            { label: "Outline", value: "outline" },
            { label: "Secondary", value: "secondary" },
            { label: "Destructive", value: "destructive" },
          ],
        },
      },
      defaultProps: {
        label: "Learn more",
        href: "#",
        variant: "default",
      },
      render: ({ label, href, variant }) => (
        <div className="px-8 py-6">
          <Button render={<a href={href} />} variant={variant}>
            {label}
          </Button>
        </div>
      ),
    },
    Card: {
      fields: {
        title: { type: "text" },
        description: { type: "text" },
        content: { type: "textarea" },
      },
      defaultProps: {
        title: "Card title",
        description: "A short supporting description.",
        content: "Use cards to group related content and actions.",
      },
      render: ({ title, description, content }) => (
        <div className="px-8 py-6">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{content}</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    Accordion: {
      fields: {
        title: { type: "text" },
        content: { type: "textarea" },
      },
      defaultProps: {
        title: "What is included?",
        content: "Describe the answer or supporting details here.",
      },
      render: ({ title, content }) => (
        <div className="max-w-2xl px-8 py-6">
          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    Tabs: {
      fields: {
        firstLabel: { type: "text" },
        firstContent: { type: "textarea" },
        secondLabel: { type: "text" },
        secondContent: { type: "textarea" },
      },
      defaultProps: {
        firstLabel: "Overview",
        firstContent: "Add overview content here.",
        secondLabel: "Details",
        secondContent: "Add detailed content here.",
      },
      render: ({ firstLabel, firstContent, secondLabel, secondContent }) => (
        <div className="max-w-2xl px-8 py-6">
          <Tabs defaultValue="first">
            <TabsList>
              <TabsTrigger value="first">{firstLabel}</TabsTrigger>
              <TabsTrigger value="second">{secondLabel}</TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="py-4">
              {firstContent}
            </TabsContent>
            <TabsContent value="second" className="py-4">
              {secondContent}
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    Dialog: {
      fields: {
        trigger: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
      },
      defaultProps: {
        trigger: "Open dialog",
        title: "Dialog title",
        description: "Add the information visitors should see in this dialog.",
      },
      render: ({ trigger, title, description }) => (
        <div className="px-8 py-6">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              {trigger}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  },
};

export const initialData: Data<PageComponents> = {
  root: { props: { title: "Home" } },
  content: [
    {
      type: "Heading",
      props: {
        id: "heading-1",
        text: "Puck is ready",
        level: "h1",
      },
    },
    {
      type: "Text",
      props: {
        id: "text-1",
        text: "Drag components from the left panel, edit their fields, and publish when you are done.",
      },
    },
  ],
};