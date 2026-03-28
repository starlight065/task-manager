export type SupportedLanguage = "en" | "uk";

type TranslationParams = Record<string, boolean | number | string | undefined>;
type TranslationResolver = (params: TranslationParams) => string;
type TranslationEntry = TranslationResolver | TranslationMap | string;

interface TranslationMap {
  [key: string]: TranslationEntry;
}

const localeByLanguage: Record<SupportedLanguage, string> = {
  en: "en-US",
  uk: "uk-UA",
};

let currentLanguage: SupportedLanguage = "en";

function pluralizeEnglish(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function pluralizeUkrainian(count: number, one: string, few: string, many: string) {
  const absCount = Math.abs(count);
  const mod10 = absCount % 10;
  const mod100 = absCount % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${one}`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${few}`;
  }

  return `${count} ${many}`;
}

function getCount(params: TranslationParams, key = "count") {
  const value = params[key];

  return typeof value === "number" ? value : Number(value ?? 0);
}

function getText(params: TranslationParams, key: string) {
  const value = params[key];

  return typeof value === "string" ? value : String(value ?? "");
}

const resources: Record<SupportedLanguage, TranslationMap> = {
  en: {
    common: {
      appName: "Task Manager",
      email: "Email",
      password: "Password",
      title: "Title",
      descriptionOptional: "Description (optional)",
      priority: "Priority",
      dueDate: "Due Date",
      dueDateOptional: "Due date (optional)",
      tag: "Tag",
      tagOptional: "Tag (optional)",
      status: "Status",
      search: "Search",
      sort: "Sort",
      cancel: "Cancel",
      close: "Close",
      add: "Add",
      today: "Today",
      list: "List",
      calendar: "Calendar",
      loading: "Loading...",
      active: "Active",
      completed: "Completed",
      all: "All",
      inProgress: "In progress",
      requestFailed: "Request failed",
      priorityLevels: {
        high: "High",
        medium: "Medium",
        low: "Low",
      },
    },
    footer: {
      label: "Language",
      switcherAriaLabel: "Switch application language",
      english: "English",
      ukrainian: "Українська",
      switchToEnglish: "Switch to English",
      switchToUkrainian: "Switch to Ukrainian",
    },
    home: {
      tagline: "Your Personal Productivity Partner",
      login: "Login",
      signUp: "Sign Up",
      aboutTitle: "About This Project",
      aboutParagraphOne:
        "This Task Manager is a powerful tool designed to help you organize your life, track your responsibilities, and boost your productivity. Whether you're managing personal errands, academic deadlines, or professional projects, our application provides the features you need to stay on top of everything.",
      aboutParagraphTwo:
        "Our goal is to offer a clean, intuitive, and efficient user experience, allowing you to focus on what truly matters: getting things done.",
      featuresTitle: "Key Features",
      taskCreationTitle: "Task Creation",
      taskCreationDescription:
        "Easily create tasks with titles, detailed descriptions, and due dates.",
      priorityLevelsTitle: "Priority Levels",
      priorityLevelsDescription: "Assign priorities to focus on what's most important:",
      progressTrackingTitle: "Progress Tracking",
      progressTrackingDescription:
        "Stay on top of momentum with active and completed task sections plus a clear progress summary.",
      secureAuthenticationTitle: "Secure Authentication",
      secureAuthenticationDescription:
        "Your data is protected with a secure login and registration system.",
      sortingFilteringTitle: "Sorting and Filtering",
      sortingFilteringDescription:
        "Quickly find tasks by sorting them by due date, priority, or creation date.",
      readyTitle: "Ready to Get Started?",
      readyDescription:
        "Sign up for a free account today and take the first step towards a more organized life.",
      signUpNow: "Sign Up Now",
      calendarAlt: "Calendar",
    },
    auth: {
      backToHome: "Back to Home",
      subtitle: "Use your email and password to continue.",
      loginTitle: "Welcome back",
      signupTitle: "Create account",
      loginSubmit: "Login",
      signupSubmit: "Sign Up",
      loginPasswordPlaceholder: "Enter your password",
      signupPasswordPlaceholder: "Create a password",
      loginFooterPrompt: "Don't have an account yet?",
      loginFooterLink: "Signup",
      signupFooterPrompt: "Already have an account?",
      signupFooterLink: "Login",
      loginErrorTitle: "Login failed",
      signupErrorTitle: "Signup failed",
      showPassword: "Show",
      hidePassword: "Hide",
      tryAgain: "Try again",
      passwordHelper: "Password must meet both requirements below.",
      messages: {
        emailInvalid: "Please enter a valid email",
        passwordMinLength: "At least {{count}} characters",
        passwordSpecialCharacter: "Minimum 1 special character",
        missingFields: "Email and password are required",
        invalidFormat: "Invalid email or password format",
        emailAlreadyExists: "Email already registered",
        invalidCredentials: "Invalid credentials",
        unauthorized: "Unauthorized",
        serverError: "Server error",
        sessionExpired: "Session expired. Please log in again.",
        sessionRestoreFailed: "Failed to restore session",
        loginNetworkError: "Login failed: could not reach server",
        signupNetworkError: "Signup failed: could not reach server",
      },
    },
    tasks: {
      pageTitle: "Task manager",
      deadlineCalendar: "Deadline calendar",
      stats: {
        pending: "pending",
        done: "done",
        total: "total",
      },
      loadingTasks: "Loading tasks",
      viewAriaLabel: "Task views",
      toolbar: {
        newTask: "New task",
        sortOptions: {
          dueDate: "Due date",
          priority: "Priority",
          created: "Created",
        },
        statusOptions: {
          active: "Active",
          completed: "Completed",
        },
      },
      list: {
        sectionHeading: (params) =>
          `${getText(params, "title")}: ${pluralizeEnglish(getCount(params), "task", "tasks")}`,
        empty: "No tasks match your current search and filters.",
      },
      progress: {
        completed: (params) => `${getCount(params, "done")} / ${getCount(params, "total")} completed`,
      },
      columns: {
        priority: "Priority",
        dueDate: "Due Date",
        tag: "Tag",
      },
      card: {
        share: "Share",
        revoke: "Revoke",
        publicLinkEnabled: "Public link enabled",
        subtaskCompletion: "Subtask completion",
        createLinkAriaLabel: "Create shared task link",
        copyLinkAriaLabel: "Copy shared task link",
        revokeLinkAriaLabel: "Revoke shared task link",
        editTaskAriaLabel: "Edit task",
        deleteTaskAriaLabel: "Delete task",
        markTaskAriaLabel: (params) =>
          `Mark ${getText(params, "title")} as ${params.completed ? "incomplete" : "completed"}`,
        markSubtaskAriaLabel: (params) =>
          `Mark subtask "${getText(params, "title")}" as ${
            params.completed ? "incomplete" : "completed"
          }`,
        moreCount: (params) => `+${getCount(params)} more`,
      },
      modal: {
        newTitle: "New task",
        editTitle: "Edit task",
        closeNew: "Close new task modal",
        closeEdit: "Close edit task modal",
        saving: "Saving...",
        saveTask: "Save task",
        updateTask: "Update task",
        subtasks: "Subtasks",
        addSubtask: "Add subtask",
        removeSubtask: (params) => `Remove subtask "${getText(params, "title")}"`,
      },
      delete: {
        title: "Delete task?",
        confirmBefore: "Are you sure you want to delete",
        confirmAfter: "This action cannot be undone.",
        deleting: "Deleting...",
        delete: "Delete",
      },
      error: {
        title: "Could not update task",
      },
      calendar: {
        changeMonth: "Change month",
        showPreviousMonth: "Show previous month",
        showNextMonth: "Show next month",
        subtitle: "Click a day to review the tasks due then.",
        dayTaskCount: (params) => pluralizeEnglish(getCount(params), "task", "tasks"),
        selectedDay: "Selected day",
        panelCount: (params) =>
          `${pluralizeEnglish(getCount(params), "task", "tasks")} due`,
        empty: (params) => `No tasks due on ${getText(params, "date")}.`,
      },
      share: {
        linkCopied: "Link copied",
        clipboardUnsupported: "Clipboard copy is not supported in this browser",
        generateFailed: "Failed to generate share link",
      },
      errors: {
        loadTasks: "Failed to load tasks",
        loadSharedTask: "Failed to load shared task",
        createTask: "Failed to create task",
        saveTask: "Failed to save task",
        createShareLink: "Failed to create share link",
        copyShareLink: "Failed to copy share link",
        revokeShareLink: "Failed to revoke share link",
        updateTask: "Failed to update task",
        updateSubtask: "Failed to update subtask",
        deleteTask: "Failed to delete task",
      },
    },
    publicTask: {
      loading: "Loading shared task...",
      unavailableTitle: "Shared task unavailable",
      unavailableDescription: "This link is invalid or expired.",
      openApp: "Go to Task Manager",
      checklist: "Checklist",
    },
    validation: {
      titleRequired: "Title is required.",
      priorityRequired: "Priority is required.",
      dueDatePast: "Due date cannot be in the past.",
    },
  },
  uk: {
    common: {
      appName: "Менеджер завдань",
      email: "Email",
      password: "Пароль",
      title: "Назва",
      descriptionOptional: "Опис (необов'язково)",
      priority: "Пріоритет",
      dueDate: "Термін",
      dueDateOptional: "Термін (необов'язково)",
      tag: "Тег",
      tagOptional: "Тег (необов'язково)",
      status: "Статус",
      search: "Пошук",
      sort: "Сортування",
      cancel: "Скасувати",
      close: "Закрити",
      add: "Додати",
      today: "Сьогодні",
      list: "Список",
      calendar: "Календар",
      loading: "Завантаження...",
      active: "Активні",
      completed: "Виконані",
      all: "Усі",
      inProgress: "У процесі",
      requestFailed: "Запит не вдався",
      priorityLevels: {
        high: "Високий",
        medium: "Середній",
        low: "Низький",
      },
    },
    footer: {
      label: "Мова",
      switcherAriaLabel: "Перемкнути мову застосунку",
      english: "English",
      ukrainian: "Українська",
      switchToEnglish: "Перемкнути на англійську",
      switchToUkrainian: "Перемкнути на українську",
    },
    home: {
      tagline: "Ваш персональний партнер для продуктивності",
      login: "Увійти",
      signUp: "Зареєструватися",
      aboutTitle: "Про цей проєкт",
      aboutParagraphOne:
        "Цей менеджер завдань допомагає впорядковувати справи, відстежувати обов'язки та підвищувати продуктивність. Незалежно від того, чи керуєте ви особистими справами, навчальними дедлайнами або робочими проєктами, застосунок надає інструменти, щоб усе тримати під контролем.",
      aboutParagraphTwo:
        "Наша мета - забезпечити зрозумілий, інтуїтивний та ефективний досвід користування, щоб ви могли зосередитися на тому, що справді важливо: виконанні справ.",
      featuresTitle: "Ключові можливості",
      taskCreationTitle: "Створення завдань",
      taskCreationDescription:
        "Легко створюйте завдання з назвою, детальним описом і терміном виконання.",
      priorityLevelsTitle: "Рівні пріоритету",
      priorityLevelsDescription: "Призначайте пріоритети, щоб зосередитися на найважливішому:",
      progressTrackingTitle: "Відстеження прогресу",
      progressTrackingDescription:
        "Слідкуйте за просуванням завдяки спискам активних і виконаних завдань та зрозумілому підсумку прогресу.",
      secureAuthenticationTitle: "Безпечна автентифікація",
      secureAuthenticationDescription:
        "Ваші дані захищені завдяки безпечній системі входу та реєстрації.",
      sortingFilteringTitle: "Сортування та фільтрація",
      sortingFilteringDescription:
        "Швидко знаходьте завдання, сортуючи їх за терміном, пріоритетом або датою створення.",
      readyTitle: "Готові почати?",
      readyDescription:
        "Створіть безкоштовний акаунт вже сьогодні та зробіть перший крок до більш організованого життя.",
      signUpNow: "Зареєструватися зараз",
      calendarAlt: "Календар",
    },
    auth: {
      backToHome: "Назад на головну",
      subtitle: "Використайте email і пароль, щоб продовжити.",
      loginTitle: "З поверненням",
      signupTitle: "Створити акаунт",
      loginSubmit: "Увійти",
      signupSubmit: "Зареєструватися",
      loginPasswordPlaceholder: "Введіть пароль",
      signupPasswordPlaceholder: "Створіть пароль",
      loginFooterPrompt: "Ще не маєте акаунта?",
      loginFooterLink: "Реєстрація",
      signupFooterPrompt: "Вже маєте акаунт?",
      signupFooterLink: "Вхід",
      loginErrorTitle: "Не вдалося увійти",
      signupErrorTitle: "Не вдалося зареєструватися",
      showPassword: "Показати",
      hidePassword: "Сховати",
      tryAgain: "Спробувати знову",
      passwordHelper: "Пароль має відповідати обом вимогам нижче.",
      messages: {
        emailInvalid: "Будь ласка, введіть дійсний email",
        passwordMinLength: "Щонайменше {{count}} символів",
        passwordSpecialCharacter: "Мінімум 1 спеціальний символ",
        missingFields: "Email і пароль є обов'язковими",
        invalidFormat: "Неправильний формат email або пароля",
        emailAlreadyExists: "Email вже зареєстровано",
        invalidCredentials: "Неправильні облікові дані",
        unauthorized: "Немає доступу",
        serverError: "Помилка сервера",
        sessionExpired: "Сесію завершено. Будь ласка, увійдіть знову.",
        sessionRestoreFailed: "Не вдалося відновити сесію",
        loginNetworkError: "Не вдалося увійти: сервер недоступний",
        signupNetworkError: "Не вдалося зареєструватися: сервер недоступний",
      },
    },
    tasks: {
      pageTitle: "Менеджер завдань",
      deadlineCalendar: "Календар дедлайнів",
      stats: {
        pending: "активні",
        done: "виконано",
        total: "усього",
      },
      loadingTasks: "Завантаження завдань",
      viewAriaLabel: "Подання завдань",
      toolbar: {
        newTask: "Нове завдання",
        sortOptions: {
          dueDate: "За терміном",
          priority: "За пріоритетом",
          created: "За датою створення",
        },
        statusOptions: {
          active: "Активні",
          completed: "Виконані",
        },
      },
      list: {
        sectionHeading: (params) =>
          `${getText(params, "title")}: ${pluralizeUkrainian(getCount(params), "завдання", "завдання", "завдань")}`,
        empty: "Немає завдань, що відповідають поточному пошуку та фільтрам.",
      },
      progress: {
        completed: (params) => `${getCount(params, "done")} / ${getCount(params, "total")} виконано`,
      },
      columns: {
        priority: "Пріоритет",
        dueDate: "Термін",
        tag: "Тег",
      },
      card: {
        share: "Поділитися",
        revoke: "Скасувати",
        publicLinkEnabled: "Публічне посилання увімкнено",
        subtaskCompletion: "Прогрес підзавдань",
        createLinkAriaLabel: "Створити спільне посилання на завдання",
        copyLinkAriaLabel: "Скопіювати спільне посилання на завдання",
        revokeLinkAriaLabel: "Скасувати спільне посилання на завдання",
        editTaskAriaLabel: "Редагувати завдання",
        deleteTaskAriaLabel: "Видалити завдання",
        markTaskAriaLabel: (params) =>
          `Позначити "${getText(params, "title")}" як ${
            params.completed ? "невиконане" : "виконане"
          }`,
        markSubtaskAriaLabel: (params) =>
          `Позначити підзавдання "${getText(params, "title")}" як ${
            params.completed ? "невиконане" : "виконане"
          }`,
        moreCount: (params) => `+ще ${getCount(params)}`,
      },
      modal: {
        newTitle: "Нове завдання",
        editTitle: "Редагувати завдання",
        closeNew: "Закрити модальне вікно нового завдання",
        closeEdit: "Закрити модальне вікно редагування завдання",
        saving: "Збереження...",
        saveTask: "Зберегти завдання",
        updateTask: "Оновити завдання",
        subtasks: "Підзавдання",
        addSubtask: "Додати підзавдання",
        removeSubtask: (params) => `Видалити підзавдання "${getText(params, "title")}"`,
      },
      delete: {
        title: "Видалити завдання?",
        confirmBefore: "Ви впевнені, що хочете видалити",
        confirmAfter: "Цю дію неможливо скасувати.",
        deleting: "Видалення...",
        delete: "Видалити",
      },
      error: {
        title: "Не вдалося оновити завдання",
      },
      calendar: {
        changeMonth: "Змінити місяць",
        showPreviousMonth: "Показати попередній місяць",
        showNextMonth: "Показати наступний місяць",
        subtitle: "Натисніть на день, щоб переглянути завдання з дедлайном на цю дату.",
        dayTaskCount: (params) =>
          pluralizeUkrainian(getCount(params), "завдання", "завдання", "завдань"),
        selectedDay: "Обраний день",
        panelCount: (params) =>
          `${pluralizeUkrainian(getCount(params), "завдання", "завдання", "завдань")} із дедлайном`,
        empty: (params) => `На ${getText(params, "date")} немає завдань із дедлайном.`,
      },
      share: {
        linkCopied: "Посилання скопійовано",
        clipboardUnsupported: "Копіювання в буфер обміну не підтримується у цьому браузері",
        generateFailed: "Не вдалося створити посилання для поширення",
      },
      errors: {
        loadTasks: "Не вдалося завантажити завдання",
        loadSharedTask: "Не вдалося завантажити спільне завдання",
        createTask: "Не вдалося створити завдання",
        saveTask: "Не вдалося зберегти завдання",
        createShareLink: "Не вдалося створити спільне посилання",
        copyShareLink: "Не вдалося скопіювати спільне посилання",
        revokeShareLink: "Не вдалося скасувати спільне посилання",
        updateTask: "Не вдалося оновити завдання",
        updateSubtask: "Не вдалося оновити підзавдання",
        deleteTask: "Не вдалося видалити завдання",
      },
    },
    publicTask: {
      loading: "Завантаження спільного завдання...",
      unavailableTitle: "Спільне завдання недоступне",
      unavailableDescription: "Це посилання недійсне або термін його дії закінчився.",
      openApp: "Перейти до менеджера завдань",
      checklist: "Чеклист",
    },
    validation: {
      titleRequired: "Назва є обов'язковою.",
      priorityRequired: "Пріоритет є обов'язковим.",
      dueDatePast: "Термін не може бути в минулому.",
    },
  },
};

function getEntry(language: SupportedLanguage, key: string): TranslationEntry | undefined {
  return key.split(".").reduce<TranslationEntry | undefined>((entry, segment) => {
    if (!entry || typeof entry === "string" || typeof entry === "function") {
      return undefined;
    }

    return entry[segment];
  }, resources[language]);
}

function interpolate(template: string, params: TranslationParams) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ""));
}

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return value === "en" || value === "uk";
}

export function setI18nLanguage(language: SupportedLanguage) {
  currentLanguage = language;
}

export function getI18nLanguage() {
  return currentLanguage;
}

export function getI18nLocale(language = currentLanguage) {
  return localeByLanguage[language];
}

export function t(
  key: string,
  params: TranslationParams = {},
  language = currentLanguage,
): string {
  const entry = getEntry(language, key);

  if (typeof entry === "function") {
    return entry(params);
  }

  if (typeof entry === "string") {
    return interpolate(entry, params);
  }

  return key;
}
