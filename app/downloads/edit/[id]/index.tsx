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
  FontSizeOutlined,
  LinkOutlined,
  PlusOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import {
  Author,
  Item,
  ItemAuthor,
  ModdingTeam,
  ModItemsModdingTeams,
} from "@/types";

type KeyValueRow = {
  key?: string;
  value?: string | boolean | number | null | object;
};

type AuthorRow = {
  name?: string;
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
  templatesUrl?: string;
  setupsUrl?: string;
  released: boolean;
  releaseDate: Dayjs | null;
  specs?: KeyValueRow[];
  metadata?: KeyValueRow[];
  features?: KeyValueRow[];
  screenshots?: string[];
  authors?: AuthorRow[];
  authorTeams?: number[];
};

type EditDownloadFormProps = {
  itemId?: string;
  initialItem?: Item | null;
  authors?: Author[];
  moddingTeams?: ModdingTeam[];
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

const DEFAULT_FEATURES_LIST: string[] = [
  'Supported by Studio397',
  'Tested by professional drivers',
  'Detailed tyre model',
  'New sound engine',
  'Rain effects',
  'Latest IBL shaders and materials',
  'S397 driver hands and animation',
  'Detailed LCD dashboard',
  'New UI icons and graphics',
  'Tweaked AI for offline racing',
  'Paintable car parts',
];

const DEFAULT_SPECS_LIST: string[] = [
  "Power",
  "Engine",
  "Torque",
  "Gearbox",
  "Length",
  "Width",
  "Wheelbase",
  "Front Track",
  "Rear Track",
  "Brakes",
  "Rims and Tyres",
  "Minimum Dry Weight",
  "Fuel Capacity",
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
  authorTeams: [],
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
          return String((entry as KeyValueRow).value ?? "");
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
      .map((entry: KeyValueRow) => {
        if (!entry || typeof entry !== "object") return null;
        if ("key" in entry && "value" in entry) {
          return {
            key: String((entry).key ?? ""),
            value:
              (entry).value === undefined || (entry).value === null
                ? ""
                : String((entry).value),
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

const buildFormValuesFromItem = (item: Item): DownloadFormValues => ({
  ...buildEmptyFormValues(),
  name: item?.name ?? "",
  description: item?.description ?? "",
  type: item?.type ?? DEFAULT_TYPE,
  carClass: item?.carClass ?? DEFAULT_CLASS,
  image: item?.image ?? "",
  logo: item?.logo ?? "",
  url: item?.url ?? "",
  templatesUrl: item?.templatesUrl ?? "",
  setupsUrl: item?.setupsUrl ?? "",
  released: Boolean(item?.released),
  releaseDate: item?.releaseDate ? dayjs(item.releaseDate) : null,
  specs: toKeyValueList(item?.specs),
  metadata: toKeyValueList(item?.metadata),
  features: toKeyValueList(item?.features),
  screenshots: ensureAtLeastOne(ensureArrayOfStrings(item?.screenshots)),
  authors: Array.isArray(item?.authors)
    ? item.authors.sort((a: ItemAuthor, b: ItemAuthor) => {
        return AUTHORS_CAT_ORDER_LIST.indexOf(a?.role) - AUTHORS_CAT_ORDER_LIST.indexOf(b?.role);
      }).map((row: ItemAuthor) => ({
        name: row?.author?.name ?? "",
        url: row?.author?.url ?? "",
        role: row?.role ?? "",
      }))
    : [],
  authorTeams: item?.authorTeams.map((elem: ModItemsModdingTeams) => elem.team.id),
});

const prepareStringValue = (value: string | number | object | boolean | null | undefined) =>
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

const transformValuesForRequest = (values: DownloadFormValues, authors: Author[]) => {
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
    templatesUrl: values.templatesUrl?.trim() || null,
    setupsUrl: values.setupsUrl?.trim() || null,
    released: values.released,
    releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null,
    specs: specs ?? null,
    metadata: metadata ?? null,
    features: keyValueListToRecord(values.features),
    screenshots: sanitizeStringList(values.screenshots),
  };

  payload.authors = (values.authors || []).map((row) => {
    const id = row?.name as string;
    const author = authors.find(a => id === (typeof id === "string" ? a.name : a.id));
    
    return {
      role: row?.role?.trim() || "Contributor",
      author
    };
  });

  payload.authorTeams = values?.authorTeams;

  return payload;
};

const ValuesWithCheckboxesList = ({
  name,
  addButtonLabel,
  defaultValues = [],
}: {
  name: string;
  addButtonLabel: string;
  defaultValues: string[];
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
        <Space size={6} direction="horizontal">
          <Button
            type="dashed"
            onClick={() => add({ key: "", value: "" })}
            icon={<PlusOutlined />}
          >
            {addButtonLabel}
          </Button>
          <Button
            type="dashed"
            onClick={() => defaultValues.forEach((value) => add({ key: value, value: false }))}
            icon={<PlusOutlined />}
            disabled={fields.length !== 0}
          >
            Put default values
          </Button>
        </Space>
      </Space>
    )}
  </Form.List>
);

const KeyValueListField = ({
  name,
  addButtonLabel,
  valuePlaceholder,
  defaultValues = [],
}: {
  name: string;
  addButtonLabel: string;
  valuePlaceholder?: string;
  defaultValues: string[];
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
        <Space size={6} direction="horizontal">
          <Button
            type="dashed"
            onClick={() => add({ key: "", value: "" })}
            icon={<PlusOutlined />}
          >
            {addButtonLabel}
          </Button>
          <Button
            type="dashed"
            onClick={() => defaultValues.forEach((value) => add({ key: value, value: "" }))}
            icon={<PlusOutlined />}
            disabled={fields.length !== 0}
          >
            Put default values
          </Button>
        </Space>
      </Space>
    )}
  </Form.List>
);

const AuthorsListField = ({
  name,
  addButtonLabel,
  authors,
  defaultValues = [],
}: {
  name: string;
  addButtonLabel: string;
  authors: Author[];
  defaultValues: string[];
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
          <Row key={`role-${key}`} gutter={12}>
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
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
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
        <Space size={6} direction="horizontal">
          <Button
            type="dashed"
            onClick={() => add({ role: "", name: ""})}
            icon={<PlusOutlined />}
          >
            {addButtonLabel}
          </Button>
          <Button
            type="dashed"
            onClick={() => defaultValues.forEach((value) => add({ role: value, name: ""}))}
            icon={<PlusOutlined />}
            disabled={fields.length !== 0}
          >
            Put default values
          </Button>
        </Space>
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
    const hydrate = (item: Item) => {
      const hydrated = item
        ? buildFormValuesFromItem(item)
        : buildEmptyFormValues();
      setInitialValues(hydrated);
      form.setFieldsValue(hydrated);
      setLoadingItem(false);
    };

    if (isNewItem) {
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

    message.success(isNewItem ? "Download item created." : "Changes saved.");

    setSaving(false);
  };

  const pageTitle = isNewItem
    ? "Create new item"
    : `Edit item - ${initialItem?.name}`;
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
                      <Input placeholder="e.g. Porsche 963 LMDh" allowClear addonBefore={<FontSizeOutlined />} />
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
                      <Input placeholder="https://..." allowClear addonBefore={<LinkOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Logo URL" name="logo">
                      <Input placeholder="https://..." allowClear addonBefore={<LinkOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Download URL" name="url">
                      <Input placeholder="https://..." allowClear addonBefore={<LinkOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Templates URL" name="templatesUrl">
                      <Input placeholder="https://..." allowClear addonBefore={<LinkOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Setups URL" name="setupsUrl">
                      <Input placeholder="https://..." allowClear addonBefore={<LinkOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} md={24}>
                    <Form.Item
                      label="Author Teams"
                      name="authorTeams"
                    >
                      <Select
                        mode="multiple"
                        placeholder="Choose modding teams"
                        options={(moddingTeams || []).map(team => ({
                          label: team.name,
                          value: team.id,
                        }))}
                      />
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
                  defaultValues={DEFAULT_FEATURES_LIST}
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
                  defaultValues={DEFAULT_SPECS_LIST}
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
                  defaultValues={AUTHORS_CAT_ORDER_LIST}
                />
              </Card>
            </Col>
          </Row>
          <Divider />

          <Space style={{
              position: 'sticky',
              bottom: '0',
              background: '#fff',
              width: '100%',
              padding: '1rem 4rem 1rem'
            }}>
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
