"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import {
  Authors,
  ModdingTeams,
} from "@/types";

type KeyValueRow = {
  key?: string;
  value?: string | boolean | number | null | {};
};

type AuthorRow = {
  name?: string;
  url?: string;
  role?: string;
};

type DownloadFormValues = {
  name: string;
  description?: string;
  type: string;
  carClass: string;
  image?: string;
  logo?: string;
  url?: string;
  released: boolean;
  releaseDate: Dayjs | null;
  specs?: KeyValueRow[];
  metadata?: KeyValueRow[];
  features?: KeyValueRow[];
  screenshots?: string[];
  authors?: AuthorRow[];
};

type EditDownloadFormProps = {
  itemId?: string;
  initialItem?: any | null;
  authors?: Authors[];
  moddingTeams?: ModdingTeams[];
};

const CAR_CLASS_OPTIONS: string[] = [
  "Le Mans Hypercars",
  "Open Wheelers",
  "Touring Cars",
  "Stock Cars",
  "Prototypes",
  "GT500",
  "GT Cars",
  "Drift Cars",
  "Skinpacks",
];

const AUTHORS_CAT_ORDER_LIST: string[] = [
  "3d",
  "Assets & materials",
  "Animations",
  "Sounds",
  "Physics",
  "Testing",
  "Textures",
  "Liveries",
  "Helmet",
];

const DOWNLOAD_TYPE_OPTIONS = [
  { label: "Steam Workshop Item", value: "steam_workshop_item" },
  { label: "URD Shop Item", value: "urd_shop_item" },
  { label: "Steam Store Item", value: "steam_store_item" },
];

const DEFAULT_TYPE = DOWNLOAD_TYPE_OPTIONS[0]?.value ?? "steam_workshop_item";
const DEFAULT_CLASS = CAR_CLASS_OPTIONS[0] ?? "Open Wheelers";

const buildEmptyFormValues = (): DownloadFormValues => ({
  name: "",
  description: "",
  type: DEFAULT_TYPE,
  carClass: DEFAULT_CLASS,
  image: "",
  logo: "",
  url: "",
  released: false,
  releaseDate: null,
  specs: [],
  metadata: [],
  features: [],
  screenshots: [""],
  authors: [],
});

const safeParseJson = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const ensureArrayOfStrings = (value: unknown): string[] => {
  const parsed = safeParseJson(value);
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    return parsed
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object" && "value" in entry) {
          return String((entry as any).value ?? "");
        }
        return String(entry ?? "");
      })
      .filter((entry) => entry !== "null" && entry !== "undefined");
  }
  if (typeof parsed === "string") return parsed ? [parsed] : [];
  return [];
};

const ensureAtLeastOne = (values: string[]): string[] =>
  values.length ? values : [""];

const toKeyValueList = (value: unknown): KeyValueRow[] => {
  const parsed = safeParseJson(value);
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        if ("key" in entry && "value" in entry) {
          return {
            key: String((entry as any).key ?? ""),
            value:
              (entry as any).value === undefined || (entry as any).value === null
                ? ""
                : String((entry as any).value),
          };
        }
        const [firstKey] = Object.keys(entry as Record<string, unknown>);
        if (!firstKey) return null;
        return {
          key: firstKey,
          value: String((entry as Record<string, unknown>)[firstKey] ?? ""),
        };
      })
      .filter(Boolean) as KeyValueRow[];
  }
  if (typeof parsed === "object") {
    return Object.entries(parsed as Record<string, unknown>).map(
      ([key, val]) => ({
        key,
        value: val === null || val === undefined ? "" : val,
      }),
    );
  }
  return [];
};

const buildFormValuesFromItem = (item: any): DownloadFormValues => ({
  ...buildEmptyFormValues(),
  name: item?.name ?? "",
  description: item?.description ?? "",
  type: item?.type ?? DEFAULT_TYPE,
  carClass: item?.carClass ?? DEFAULT_CLASS,
  image: item?.image ?? "",
  logo: item?.logo ?? "",
  url: item?.url ?? "",
  released: Boolean(item?.released),
  releaseDate: item?.releaseDate ? dayjs(item.releaseDate) : null,
  specs: toKeyValueList(item?.specs),
  metadata: toKeyValueList(item?.metadata),
  features: toKeyValueList(item?.features),
  screenshots: ensureAtLeastOne(ensureArrayOfStrings(item?.screenshots)),
  authors: Array.isArray(item?.authors)
    ? item.authors.sort((a: any, b: any) => {
        return AUTHORS_CAT_ORDER_LIST.indexOf(a?.role) - AUTHORS_CAT_ORDER_LIST.indexOf(b?.role);
      }).map((row: any) => ({
        name: row?.author?.name ?? "",
        url: row?.author?.url ?? "",
        role: row?.role ?? "",
      }))
    : [],
});

const prepareStringValue = (value: any) =>
  typeof value === "string" ? value.trim() : value;

const keyValueListToRecord = (
  rows?: KeyValueRow[],
): Record<string, string> | undefined => {
  if (!rows) return {};
  const entries = rows
    .map((row) => {
      const key = row?.key?.trim();
      if (!key) return null;
      return [key, prepareStringValue(row?.value)] as [string, string];
    })
    .filter(Boolean) as [string, string][];

  if (!entries.length) return {};
  return Object.fromEntries(entries);
};

const sanitizeStringList = (list?: string[]): string[] => {
  if (!list) return [];
  return list.map((value) => (value ?? "").trim()).filter(Boolean);
};

const transformValuesForRequest = (values: DownloadFormValues, authors: Authors[]) => {
  const specs = keyValueListToRecord(values.specs);
  const metadata = keyValueListToRecord(values.metadata);
  const payload: Record<string, unknown> = {
    name: values.name.trim(),
    description: values.description?.trim() || null,
    type: values.type,
    carClass: values.carClass,
    image: values.image?.trim() || null,
    logo: values.logo?.trim() || null,
    url: values.url?.trim() || null,
    released: values.released,
    releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
    specs: specs ?? null,
    metadata: metadata ?? null,
    features: keyValueListToRecord(values.features),
    screenshots: sanitizeStringList(values.screenshots),
  };

  const cleaned = (values.authors || [])
    .map((row) => {
      const id = row?.name as any;
      const author = authors.find(a => id === (typeof id === "string" ? a.name : a.id));
      
      return {
        role: row?.role?.trim() || "Contributor",
        author
      };
    });

  if (cleaned) payload.authors = cleaned;

  return payload;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const ValuesWithCheckboxesList = ({
  name,
  addButtonLabel,
}: {
  name: string;
  addButtonLabel: string;
}) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <Space size={1} direction="vertical" style={{ width: "100%" }}>
        {fields.map(({ key, name: fieldName, ...restField }) => (
          <Space size={"small"} key={key} align="baseline" style={{ display: "flex" }}>
            <Form.Item
              {...restField}
              name={[fieldName, "value"]}
              style={{ flex: 1 }}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[fieldName, "key"]}
              rules={[{ required: true, message: "Label is required" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="E.g. Detailed tyre model" required />
            </Form.Item>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => remove(fieldName)}
              aria-label="Remove row"
            />
          </Space>
        ))}
        <Button
          type="dashed"
          onClick={() => add({ key: "", value: "" })}
          icon={<PlusOutlined />}
        >
          {addButtonLabel}
        </Button>
      </Space>
    )}
  </Form.List>
);

const KeyValueListField = ({
  name,
  addButtonLabel,
  valuePlaceholder,
}: {
  name: string;
  addButtonLabel: string;
  valuePlaceholder?: string;
}) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <Space size={1} direction="vertical" style={{ width: "100%" }}>
        <Row gutter={12} align={"middle"} style={{ marginBottom: "16px" }}>
          <Col xs={24} md={12}>
            Name
          </Col>
          <Col xs={24} md={10}>
            Value
          </Col>
          <Col xs={24} md={2}></Col>
        </Row>
        {fields.map(({ key, name: fieldName, ...restField }) => (
          <Row key={key} gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                {...restField}
                name={[fieldName, "key"]}
                rules={[{ required: true, message: "Label is required" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Label" />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                {...restField}
                name={[fieldName, "value"]}
                style={{ flex: 1 }}
              >
                <Input placeholder={valuePlaceholder ?? "Value"} />
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => remove(fieldName)}
                aria-label="Remove row"
              />
            </Col>
          </Row>
        ))}
        <Button
          type="dashed"
          onClick={() => add({ key: "", value: "" })}
          icon={<PlusOutlined />}
        >
          {addButtonLabel}
        </Button>
      </Space>
    )}
  </Form.List>
);

const AuthorsListField = ({
  name,
  addButtonLabel,
  authors,
}: {
  name: string;
  addButtonLabel: string;
  authors: Authors[];
}) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <Space size={1} direction="vertical" style={{ width: "100%" }}>
        <Row gutter={12} align={"middle"} style={{ marginBottom: "16px" }}>
          <Col xs={24} md={12}>
            Role
          </Col>
          <Col xs={24} md={10}>
            Author
          </Col>
          <Col xs={24} md={2}></Col>
        </Row>
        {fields.length === 0 && (
          <Typography.Text type="secondary">
            No contributors listed yet.
          </Typography.Text>
        )}
        {fields.map(({ key, name: fieldName, ...restField }) => (
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                {...restField}
                name={[fieldName, "role"]}
                rules={[
                  { required: true, message: "Name is required" },
                ]}
              >
                <Select
                  placeholder="Select role"
                  options={AUTHORS_CAT_ORDER_LIST.map((a) => ({
                    label: a,
                    value: a,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                {...restField}
                name={[fieldName, "name"]}
                rules={[
                  { required: true, message: "Name is required" },
                ]}
              >
                <Select
                  placeholder="Select author"
                  options={authors.map((a) => ({
                    label: a.name || "Unnamed",
                    value: a.id || "",
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={2}>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => remove(fieldName)}
                aria-label="Remove contributor"
              />
            </Col>
          </Row>
        ))}
        <Button
          type="dashed"
          onClick={() => add({ role: "", name: "", url: "" })}
          icon={<PlusOutlined />}
        >
          {addButtonLabel}
        </Button>
      </Space>
    )}
  </Form.List>
);


export default function EditDownloadForm({
  itemId,
  initialItem,
  authors,
  moddingTeams,
}: EditDownloadFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<DownloadFormValues>();
  const rawId = itemId ?? "new";
  const isNewItem = rawId === "new";

  const [initialValues, setInitialValues] = useState<DownloadFormValues>(
    buildEmptyFormValues,
  );
  const [loadingItem, setLoadingItem] = useState<boolean>(
    !isNewItem && !initialItem,
  );
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    const hydrate = (item: any) => {
      const hydrated = item
        ? buildFormValuesFromItem(item)
        : buildEmptyFormValues();
      setInitialValues(hydrated);
      form.setFieldsValue(hydrated);
      setLoadingItem(false);
    };

    if (isNewItem) {
      hydrate(null);
      setFetchError(null);
      return;
    }

    if (initialItem) {
      hydrate(initialItem);
      setFetchError(null);
      return;
    }

    setFetchError(null);
    setLoadingItem(false);
  }, [form, initialItem, isNewItem, rawId]);

  const handleBack = () => {
    router.push(isNewItem ? "/downloads" : `/downloads/${rawId}`);
  };

  const handleReset = () => {
    form.setFieldsValue(initialValues);
    message.info("Form values restored.");
  };

  const handleSubmit = async (values: DownloadFormValues) => {
    setSaving(false);
    const payload = transformValuesForRequest(values, authors || []);
    const endpoint = isNewItem ? "/api/downloads" : `/api/downloads/${rawId}`;
    const method = isNewItem ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${isNewItem ? "create" : "update"} download item`,
      );
    }

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    message.success(isNewItem ? "Download item created." : "Changes saved.");

    const nextId = isNewItem ? body?.id : rawId;
    // router.push(nextId ? `/downloads/${nextId}` : "/downloads");
    // router.refresh();
    setSaving(false);
  };

  const pageTitle = isNewItem
    ? "Create new item"
    : `Edit item - ${initialItem.name}`;
  const subtitle = isNewItem
    ? "Fill in the fields below to publish a new download entry."
    : "Update the details for this download entry.";

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Space align="center" style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back
        </Button>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {pageTitle}
        </Typography.Title>
      </Space>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {subtitle}
      </Typography.Paragraph>

      {fetchError && (
        <Alert
          style={{ marginBottom: 24 }}
          message="Failed to load download item"
          description={fetchError}
          type="error"
          showIcon
        />
      )}

      <Spin spinning={loadingItem}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
          scrollToFirstError
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Main details" variant="outlined">
                <Row gutter={12} align="middle">
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[{ required: true, message: "Name is required" }]}
                    >
                      <Input placeholder="e.g. Porsche 963 LMDh" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Release date"
                      name="releaseDate"
                      tooltip="Optional. Used for sorting and NEW badge logic."
                    >
                      <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4}>
                    <Form.Item
                      label="Released"
                      name="released"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item label="Description" name="description">
                  <Input.TextArea rows={4} placeholder="Short summary" />
                </Form.Item>
                <Row gutter={12}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Type"
                      name="type"
                      rules={[{ required: true, message: "Type is required" }]}
                    >
                      <Select
                        options={DOWNLOAD_TYPE_OPTIONS}
                        placeholder="Select type"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Car class"
                      name="carClass"
                      rules={[
                        { required: true, message: "Car class is required" },
                      ]}
                    >
                      <Select
                        options={CAR_CLASS_OPTIONS.map((label) => ({
                          label,
                          value: label,
                        }))}
                        placeholder="Select a class"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col xs={24} md={8}>
                    <Form.Item label="Hero image URL" name="image">
                      <Input placeholder="https://..." />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Logo URL" name="logo">
                      <Input placeholder="https://..." />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Download URL" name="url">
                      <Input placeholder="https://..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Screenshots" variant="outlined" style={{ marginTop: 16 }}>
                <Row gutter={12}>
                  <Col xs={24} md={24}>
                    <Form.Item
                      name="screenshots"
                    >
                      <Select
                        mode="tags"
                        placeholder="Type and press Enter…"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Features">
                <Typography.Paragraph type="secondary">
                  Highlight notable features shown on the download detail page.
                </Typography.Paragraph>
                <ValuesWithCheckboxesList
                  name="features"
                  addButtonLabel="Add feature"
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Specifications" style={{ marginTop: 16 }}>
                <Typography.Paragraph type="secondary">
                  Capture structured specs such as power, weight, tire sizes,
                  etc.
                </Typography.Paragraph>
                <KeyValueListField
                  name="specs"
                  addButtonLabel="Add specification"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Authors & Contributors" style={{ marginTop: 16 }}>
                <Typography.Paragraph type="secondary">
                  List of contributors to the project.
                </Typography.Paragraph>
                <AuthorsListField
                  name="authors"
                  addButtonLabel="Add contributor"
                  authors={authors || []}
                />
              </Card>
            </Col>
          </Row>
          <Divider />

          <Space>
            <Button onClick={handleBack} disabled={saving}>
              Cancel
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={saving}
            >
              {isNewItem ? "Create item" : "Save changes"}
            </Button>
          </Space>
        </Form>
      </Spin>
    </div>
  );
}
